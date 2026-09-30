import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId)) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    notFound();
  }

  async function updateCategory(formData: FormData) {
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

    await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name.trim(),
        icon: iconValue,
      },
    });

    redirect("/categories");
  }

  async function deleteCategory() {
    "use server";

    await prisma.category.delete({
      where: {
        id: categoryId,
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
          カテゴリを編集
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          カテゴリの情報を変更できます。
        </p>
      </div>

      <form
        action={updateCategory}
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
            defaultValue={category.name}
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
            defaultValue={category.icon ?? ""}
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
            保存する
          </button>
        </div>
      </form>

      <section className="mt-8 rounded-xl border border-red-200 bg-white p-5">
        <h2 className="font-bold text-slate-800">
          カテゴリを削除
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          このカテゴリを削除します。紐づいている在庫は削除されず、「未分類」になります。
        </p>

        <form action={deleteCategory} className="mt-4">
          <button
            type="submit"
            className="w-full rounded-lg border border-red-300 px-4 py-3 font-bold text-red-500"
          >
            カテゴリを削除
          </button>
        </form>
      </section>
    </main>
  );
}