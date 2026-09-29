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

  if (isEditing) {
    return (
      <>
        <h1>在庫を編集</h1>

        <form action={updateItem}>
          <div>
            <label htmlFor="name">商品名</label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={item.name}
              required
            />
          </div>

          <div>
            <label htmlFor="quantity">在庫数</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              defaultValue={item.quantity}
              required
            />
          </div>

          <div>
            <label htmlFor="unit">単位</label>
            <input
              id="unit"
              name="unit"
              type="text"
              defaultValue={item.unit}
              required
            />
          </div>

          <div>
            <label htmlFor="minimumStock">最低在庫数</label>
            <input
              id="minimumStock"
              name="minimumStock"
              type="number"
              min="0"
              defaultValue={item.minimumStock}
              required
            />
          </div>

          <div>
            <label htmlFor="expirationDate">期限日</label>
            <input
              id="expirationDate"
              name="expirationDate"
              type="date"
              defaultValue={item.expirationDate ?? ""}
            />
          </div>

          <div>
            <label htmlFor="categoryId">カテゴリー</label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={item.categoryId ?? ""}
            >
              <option value="">未分類</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">保存</button>

          <button type="button" onClick={() => setIsEditing(false)}>
            キャンセル
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <h1>在庫詳細</h1>

      <dl>
        <div>
          <dt>商品名</dt>
          <dd>{item.name}</dd>
        </div>

        <div>
          <dt>在庫数</dt>
          <dd>
            {item.quantity} {item.unit}
          </dd>
        </div>

        <div>
          <dt>最低在庫数</dt>
          <dd>
            {item.minimumStock} {item.unit}
          </dd>
        </div>

        <div>
          <dt>カテゴリー</dt>
          <dd>{item.categoryName}</dd>
        </div>

        <div>
          <dt>期限日</dt>
          <dd>{item.expirationDate ?? "未設定"}</dd>
        </div>

        <div>
          <dt>在庫状態</dt>
          <dd>
            {item.quantity <= item.minimumStock ? "在庫不足" : "在庫あり"}
          </dd>
        </div>
      </dl>

      <button type="button" onClick={() => setIsEditing(true)}>
        編集
      </button>
    </>
  );
}