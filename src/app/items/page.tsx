import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ItemsPage() {
  const items = await prisma.item.findMany({
    include: {
      category: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-md px-5 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">在庫一覧</h1>

        <Link
          href="/items/new"
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-white"
        >
          ＋ 在庫を登録
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="text-sm text-slate-500">
            在庫が登録されていません。
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const isLowStock = item.quantity <= item.minimumStock;

            return (
              <li key={item.id}>
                <Link
                  href={`/items/${item.id}`}
                  className="block rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate font-bold text-slate-800">
                          {item.name}
                        </h2>

                        {isLowStock && (
                          <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-500">
                            在庫不足
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {item.category?.name ?? "未分類"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <p className="text-sm text-slate-700">
                        <span className="text-lg font-bold">
                          {item.quantity}
                        </span>{" "}
                        {item.unit}
                      </p>

                      <span
                        className="text-xl text-slate-400"
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}