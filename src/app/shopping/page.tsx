import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ShoppingPage() {
  const shoppingItems = await prisma.shoppingItem.findMany({
    include: {
      item: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const items = await prisma.item.findMany({
    orderBy: {
      name: "asc",
    },
  });

  async function addShoppingItem(formData: FormData) {
    "use server";

    const name = formData.get("name");
    const quantity = formData.get("quantity");
    const itemId = formData.get("itemId");

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("商品名は必須です。");
    }

    const quantityNumber = Number(quantity);

    if (!Number.isInteger(quantityNumber) || quantityNumber < 1) {
      throw new Error("数量は1以上の整数で入力してください。");
    }

    const itemIdValue =
      typeof itemId === "string" && itemId !== ""
        ? Number(itemId)
        : null;

    await prisma.shoppingItem.create({
      data: {
        name: name.trim(),
        quantity: quantityNumber,
        itemId: itemIdValue,
      },
    });

    redirect("/shopping");
  }

  async function completeShoppingItem(formData: FormData) {
    "use server";

    const shoppingItemId = Number(formData.get("shoppingItemId"));

    if (!Number.isInteger(shoppingItemId)) {
      throw new Error("買い物項目IDが不正です。");
    }

    const shoppingItem = await prisma.shoppingItem.findUnique({
      where: {
        id: shoppingItemId,
      },
    });

    if (!shoppingItem) {
      throw new Error("買い物項目が見つかりません。");
    }

    if (shoppingItem.isCompleted) {
      redirect("/shopping");
    }

    if (shoppingItem.itemId !== null) {
      await prisma.$transaction([
        prisma.item.update({
          where: {
            id: shoppingItem.itemId,
          },
          data: {
            quantity: {
              increment: shoppingItem.quantity,
            },
          },
        }),

        prisma.shoppingItem.update({
          where: {
            id: shoppingItem.id,
          },
          data: {
            isCompleted: true,
          },
        }),
      ]);
    } else {
      await prisma.shoppingItem.update({
        where: {
          id: shoppingItem.id,
        },
        data: {
          isCompleted: true,
        },
      });
    }

    redirect("/shopping");
  }

  async function deleteShoppingItem(formData: FormData) {
    "use server";

    const shoppingItemId = Number(formData.get("shoppingItemId"));

    if (!Number.isInteger(shoppingItemId)) {
      throw new Error("買い物項目IDが不正です。");
    }

    const shoppingItem = await prisma.shoppingItem.findUnique({
      where: {
        id: shoppingItemId,
      },
    });

    if (!shoppingItem) {
      throw new Error("買い物項目が見つかりません。");
    }

    if (!shoppingItem.isCompleted) {
      throw new Error("未購入の商品は削除できません。");
    }

    await prisma.shoppingItem.delete({
      where: {
        id: shoppingItemId,
      },
    });

    redirect("/shopping");
  }

  return (
    <main>
      <h1>買い物リスト</h1>

      <section>
        <h2>買うものを追加</h2>

        <form action={addShoppingItem}>
          <div>
            <label htmlFor="name">商品名</label>
            <input id="name" name="name" type="text" required />
          </div>

          <div>
            <label htmlFor="quantity">数量</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              required
            />
          </div>

          <div>
            <label htmlFor="itemId">在庫との紐づけ</label>
            <select id="itemId" name="itemId" defaultValue="">
              <option value="">紐づけなし</option>

              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">追加</button>
        </form>
      </section>

      <section>
        <h2>買うもの</h2>

        {shoppingItems.length === 0 ? (
          <p>買い物リストは空です。</p>
        ) : (
          <ul>
            {shoppingItems.map((shoppingItem) => (
              <li key={shoppingItem.id}>
                {shoppingItem.name} × {shoppingItem.quantity}
                {" / "}
                {shoppingItem.item
                  ? `在庫：${shoppingItem.item.name}`
                  : "在庫との紐づけなし"}

                {shoppingItem.isCompleted ? (
                  <>
                    {" / 購入済み "}
                    <form
                      action={deleteShoppingItem}
                      style={{ display: "inline" }}
                    >
                      <input
                        type="hidden"
                        name="shoppingItemId"
                        value={shoppingItem.id}
                      />
                      <button type="submit">削除</button>
                    </form>
                  </>
                ) : (
                  <form
                    action={completeShoppingItem}
                    style={{ display: "inline" }}
                  >
                    <input
                      type="hidden"
                      name="shoppingItemId"
                      value={shoppingItem.id}
                    />
                    {" "}
                    <button type="submit">購入完了</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}