import Link from "next/link";
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

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-500";

  const labelClass = "font-bold text-slate-800";

  return (
    <main className="mx-auto w-full max-w-md px-5 py-6">
      <div className="mb-6">
        <Link
          href="/items"
          className="text-sm font-medium text-sky-600"
        >
          ‹ 在庫一覧に戻る
        </Link>

        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          在庫を登録
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          新しい在庫の情報を入力してください。
        </p>
      </div>

      <form
        action={createItem}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label htmlFor="name" className={labelClass}>
            品目名
            <span className="ml-2 rounded bg-red-50 px-2 py-1 text-xs text-red-500">
              必須
            </span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="例：牛乳、卵、ティッシュなど"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="categoryId" className={labelClass}>
            カテゴリ
            <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">
              任意
            </span>
          </label>

          <select
            id="categoryId"
            name="categoryId"
            defaultValue=""
            className={inputClass}
          >
            <option value="">未分類</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className={labelClass}>
              数量
              <span className="ml-2 rounded bg-red-50 px-2 py-1 text-xs text-red-500">
                必須
              </span>
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              placeholder="例：2"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="unit" className={labelClass}>
              単位
              <span className="ml-2 rounded bg-red-50 px-2 py-1 text-xs text-red-500">
                必須
              </span>
            </label>

            <input
              id="unit"
              name="unit"
              type="text"
              placeholder="例：個"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="minimumStock" className={labelClass}>
            最低在庫数
            <span className="ml-2 rounded bg-red-50 px-2 py-1 text-xs text-red-500">
              必須
            </span>
          </label>

          <input
            id="minimumStock"
            name="minimumStock"
            type="number"
            min="0"
            placeholder="例：1"
            className={inputClass}
            required
          />

          <p className="mt-2 text-xs text-slate-500">
            この数量以下になると在庫不足として表示されます。
          </p>
        </div>

        <div>
          <label htmlFor="expirationDate" className={labelClass}>
            期限日
            <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">
              任意
            </span>
          </label>

          <input
            id="expirationDate"
            name="expirationDate"
            type="date"
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 border-t border-slate-200 pt-5">
          <Link
            href="/items"
            className="flex flex-1 items-center justify-center rounded-lg border border-slate-300 px-4 py-3 font-bold text-slate-600"
          >
            キャンセル
          </Link>

          <button
            type="submit"
            className="flex-1 rounded-lg bg-sky-500 px-4 py-3 font-bold text-white"
          >
            登録する
          </button>
        </div>
      </form>
    </main>
  );
}