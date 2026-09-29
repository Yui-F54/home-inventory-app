import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ItemsPage() {
  const items = await prisma.item.findMany({
  include: {
    category: true,
  },
});

return (
  <main>
    <h1>在庫一覧</h1>
    <Link href="/items/new">在庫を登録</Link>

    {items.length === 0 ? (
      <p>在庫が登録されていません。</p>
    ) : (
    <ul>
      {items.map((item) => {
        const isLowStock = item.quantity <= item.minimumStock;

        return (
          <li key={item.id}>
            <Link href={`/items/${item.id}`}>{item.name}</Link>
              ：{item.quantity} {item.unit} /{" "}
            {item.category?.name ?? "未分類"}
            {isLowStock && " / 在庫不足"}
          </li>
        );
      })}
    </ul>
    )}
  </main>
);
}