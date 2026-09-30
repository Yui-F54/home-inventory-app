import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-sky-100 px-6 py-5">
      <Link
        href="/"
        className="mx-auto flex max-w-md items-center justify-center gap-2 text-xl font-bold text-slate-800"
      >
        <span aria-hidden="true">⌂</span>
        <span>おうち在庫管理</span>
      </Link>
    </header>
  );
}