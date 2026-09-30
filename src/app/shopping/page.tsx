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
    <main className="mx-auto w-full max-w-md px-5 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          買い物リスト
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          買うものを登録して管理します。
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-slate-800">
          買うものを追加
        </h2>

        <form
          action={addShoppingItem}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div>
            <label
              htmlFor="name"
              className="font-bold text-slate-800"
            >
              商品名
              <span className="ml-2 rounded bg-red-50 px-2 py-1 text-xs text-red-500">
                必須
              </span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="例：牛乳、ティッシュなど"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="font-bold text-slate-800"
            >
              数量
              <span className="ml-2 rounded bg-red-50 px-2 py-1 text-xs text-red-500">
                必須
              </span>
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="itemId"
              className="font-bold text-slate-800"
            >
              在庫との紐づけ
              <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">
                任意
              </span>
            </label>

            <select
              id="itemId"
              name="itemId"
              defaultValue=""
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500"
            >
              <option value="">紐づけなし</option>

              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              在庫と紐づけると、購入完了時に購入数量が在庫へ加算されます。
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-sky-500 px-4 py-3 font-bold text-white"
          >
            ＋ 買うものを追加
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-800">
          買うもの
        </h2>

        {shoppingItems.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center">
            <p className="text-sm text-slate-500">
              買い物リストは空です。
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {shoppingItems.map((shoppingItem) => (
              <li
                key={shoppingItem.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`font-bold ${
                          shoppingItem.isCompleted
                            ? "text-slate-400 line-through"
                            : "text-slate-800"
                        }`}
                      >
                        {shoppingItem.name}
                      </h3>

                      {shoppingItem.isCompleted && (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                          購入済み
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      数量：{shoppingItem.quantity}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {shoppingItem.item
                        ? `在庫：${shoppingItem.item.name}`
                        : "在庫との紐づけなし"}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {shoppingItem.isCompleted ? (
                      <form action={deleteShoppingItem}>
                        <input
                          type="hidden"
                          name="shoppingItemId"
                          value={shoppingItem.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-500"
                        >
                          削除
                        </button>
                      </form>
                    ) : (
                      <form action={completeShoppingItem}>
                        <input
                          type="hidden"
                          name="shoppingItemId"
                          value={shoppingItem.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-bold text-white"
                        >
                          購入完了
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}