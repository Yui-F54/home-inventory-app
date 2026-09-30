import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-md">
        <Link
          href="/items"
          className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-slate-600"
        >
          <span className="text-lg" aria-hidden="true">
            □
          </span>
          <span>在庫一覧</span>
        </Link>

        <Link
          href="/shopping"
          className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-slate-600"
        >
          <span className="text-lg" aria-hidden="true">
            ♡
          </span>
          <span>買い物リスト</span>
        </Link>

        <Link
          href="/categories"
          className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-slate-600"
        >
          <span className="text-lg" aria-hidden="true">
            ◇
          </span>
          <span>カテゴリ管理</span>
        </Link>
      </nav>
    </footer>
  );
}