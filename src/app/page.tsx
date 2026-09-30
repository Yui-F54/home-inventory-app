import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-10">
      <nav className="space-y-4">
        <Link
          href="/items"
          className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-5 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-800">在庫一覧</h2>
            <p className="mt-1 text-sm text-slate-500">
              おうちの在庫を確認・管理します
            </p>
          </div>

          <span className="text-xl text-slate-400" aria-hidden="true">
            ›
          </span>
        </Link>

        <Link
          href="/shopping"
          className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-5 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              買い物リスト
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              必要なものをリストで管理します
            </p>
          </div>

          <span className="text-xl text-slate-400" aria-hidden="true">
            ›
          </span>
        </Link>

        <Link
          href="/categories"
          className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-5 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              カテゴリ管理
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              カテゴリの作成・編集をします
            </p>
          </div>

          <span className="text-xl text-slate-400" aria-hidden="true">
            ›
          </span>
        </Link>
      </nav>
    </main>
  );
}