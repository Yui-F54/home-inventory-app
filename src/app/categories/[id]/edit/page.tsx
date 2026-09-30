import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
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

  return (
    <main>
      <h1>カテゴリーを編集</h1>

      <form action={updateCategory}>
        <div>
          <label htmlFor="name">カテゴリー名</label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={category.name}
            required
          />
        </div>

        <div>
          <label htmlFor="icon">アイコン（任意）</label>
          <input
            id="icon"
            name="icon"
            type="text"
            defaultValue={category.icon ?? ""}
          />
        </div>

        <button type="submit">保存</button>
      </form>

      <form action={deleteCategory}>
        <button type="submit">カテゴリーを削除</button>
      </form>

      <p>
        <Link href="/categories">カテゴリー一覧に戻る</Link>
      </p>
    </main>
  );
}