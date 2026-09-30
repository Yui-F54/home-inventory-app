import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main>
      <h1>カテゴリー一覧</h1>

      <p>
        <Link href="/categories/new">カテゴリーを追加</Link>
      </p>

      {categories.length === 0 ? (
        <p>カテゴリーが登録されていません。</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.icon && `${category.icon} `}
              {category.name}
              {" "}
              <Link href={`/categories/${category.id}/edit`}>編集</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}