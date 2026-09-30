import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default function NewCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server";

    const name = formData.get("name");
    const icon = formData.get("icon");

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("カテゴリー名は必須です。");
    }

    const iconValue =
      typeof icon === "string" && icon.trim() !== ""
        ? icon.trim()
        : null;

    await prisma.category.create({
      data: {
        name: name.trim(),
        icon: iconValue,
      },
    });

    redirect("/categories");
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-sky-500";

  return (
    <main className="mx-auto w-full max-w-md px-5 py-6">
      <div className="mb-6">
        <Link
          href="/categories"
          className="text-sm font-medium text-sky-600"
        >
          ‹ カテゴリ一覧に戻る
        </Link>

        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          カテゴリを追加
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          在庫を整理するためのカテゴリを登録します。
        </p>
      </div>

      <form
        action={createCategory}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label
            htmlFor="name"
            className="font-bold text-slate-800"
          >
            カテゴリ名
            <span className="ml-2 rounded bg-red-50 px-2 py-1 text-xs text-red-500">
              必須
            </span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="例：食品、日用品"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label
            htmlFor="icon"
            className="font-bold text-slate-800"
          >
            アイコン
            <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">
              任意
            </span>
          </label>

          <input
            id="icon"
            name="icon"
            type="text"
            placeholder="例：🍎"
            className={inputClass}
          />

          <p className="mt-2 text-xs text-slate-500">
            絵文字などを入力できます。
          </p>
        </div>

        <div className="flex gap-3 border-t border-slate-200 pt-5">
          <Link
            href="/categories"
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