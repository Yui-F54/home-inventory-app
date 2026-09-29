import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function NewItemPage() {
    async function createItem(formData: FormData) {
        "use server";
        const name = formData.get("name");
        const quantity = formData.get("quantity");
        const unit = formData.get("unit");
        const minimumStock = formData.get("minimumStock");
        const expirationDate = formData.get("expirationDate");
        const categoryId = formData.get("categoryId");
        if (typeof name !== "string" || name.trim() === "") {
          throw new Error("商品名は必須です。");
        }
        const quantityNumber = Number(quantity);
        const minimumStockNumber = Number(minimumStock);

        if (!Number.isInteger(quantityNumber) || quantityNumber < 0) {
        throw new Error("在庫数は0以上の整数で入力してください。");
        }

        if (typeof unit !== "string" || unit.trim() === "") {
          throw new Error("単位は必須です。");
        }

        if (!Number.isInteger(minimumStockNumber) || minimumStockNumber < 0) {
          throw new Error("最低在庫数は0以上の整数で入力してください。");
        }

        const expirationDateValue =
            typeof expirationDate === "string" && expirationDate !== ""
              ? new Date(expirationDate)
              : null;

        const categoryIdValue =
          typeof categoryId === "string" && categoryId !== ""
            ? Number(categoryId)
            : null;

        await prisma.item.create({
          data: {
            name: name.trim(),
            quantity: quantityNumber,
            unit: unit.trim(),
            minimumStock: minimumStockNumber,
            expirationDate: expirationDateValue,
            categoryId: categoryIdValue,
          },
        });
        redirect("/items");

    }
    const categories = await prisma.category.findMany({
        orderBy: {
        name: "asc",
        },
  });
  return (
    <main>
      <h1>在庫を登録</h1>

      <form action={createItem}>
        <div>
          <label htmlFor="name">商品名</label>
          <input id="name" name="name" type="text" required />
        </div>

        <div>
          <label htmlFor="quantity">在庫数</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="unit">単位</label>
          <input id="unit" name="unit" type="text" required />
        </div>

        <div>
          <label htmlFor="minimumStock">最低在庫数</label>
          <input
            id="minimumStock"
            name="minimumStock"
            type="number"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="expirationDate">期限日</label>
          <input
            id="expirationDate"
            name="expirationDate"
            type="date"
          />
        </div>

        <div>
          <label htmlFor="categoryId">カテゴリー</label>
          <select id="categoryId" name="categoryId">
            <option value="">未分類</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">登録</button>

      </form>
    </main>
  );
}