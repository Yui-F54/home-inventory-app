import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-md px-5 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          カテゴリ管理
        </h1>

        <Link
          href="/categories/new"
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-white"
        >
          ＋ カテゴリを追加
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="text-sm text-slate-500">
            カテゴリが登録されていません。
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.id}/edit`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {category.icon && (
                    <span
                      className="shrink-0 text-xl"
                      aria-hidden="true"
                    >
                      {category.icon}
                    </span>
                  )}

                  <span className="truncate font-bold text-slate-800">
                    {category.name}
                  </span>
                </div>

                <span
                  className="text-xl text-slate-400"
                  aria-hidden="true"
                >
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}