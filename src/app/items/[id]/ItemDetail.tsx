"use client";

import { useState } from "react";

type ItemDetailProps = {
  item: {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    minimumStock: number;
    expirationDate: string | null;
    categoryId: number | null;
    categoryName: string;
  };
  categories: {
    id: number;
    name: string;
  }[];
  updateItem: (formData: FormData) => Promise<void>;
};

export default function ItemDetail({
  item,
  categories,
  updateItem,
}: ItemDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-500";

  const labelClass = "font-bold text-slate-800";

  if (isEditing) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            在庫を編集
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            在庫の情報を変更してください。
          </p>
        </div>

        <form
          action={updateItem}
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
              defaultValue={item.name}
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
              defaultValue={item.categoryId ?? ""}
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
                defaultValue={item.quantity}
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
                defaultValue={item.unit}
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
              defaultValue={item.minimumStock}
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
              defaultValue={item.expirationDate ?? ""}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-bold text-slate-600"
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-sky-500 px-4 py-3 font-bold text-white"
            >
              保存する
            </button>
          </div>
        </form>
      </>
    );
  }

  const isLowStock = item.quantity <= item.minimumStock;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          在庫詳細
        </h1>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-white"
        >
          編集
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <p className="text-sm text-slate-500">品目名</p>

          <div className="mt-2 flex items-center gap-2">
            <p className="text-xl font-bold text-slate-800">
              {item.name}
            </p>

            {isLowStock && (
              <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-500">
                在庫不足
              </span>
            )}
          </div>
        </div>

        <dl className="divide-y divide-slate-200">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-slate-500">現在の在庫</dt>
            <dd className="font-bold text-slate-800">
              {item.quantity} {item.unit}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-slate-500">最低在庫数</dt>
            <dd className="font-bold text-slate-800">
              {item.minimumStock} {item.unit}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-slate-500">カテゴリ</dt>
            <dd className="font-bold text-slate-800">
              {item.categoryName}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-slate-500">期限日</dt>
            <dd className="font-bold text-slate-800">
              {item.expirationDate ?? "未設定"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-slate-500">在庫状態</dt>
            <dd
              className={
                isLowStock
                  ? "font-bold text-red-500"
                  : "font-bold text-emerald-600"
              }
            >
              {isLowStock ? "在庫不足" : "在庫あり"}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}