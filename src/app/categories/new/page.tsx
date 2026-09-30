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

  return (
    <main>
      <h1>カテゴリーを追加</h1>

      <form action={createCategory}>
        <div>
          <label htmlFor="name">カテゴリー名</label>
          <input id="name" name="name" type="text" required />
        </div>

        <div>
          <label htmlFor="icon">アイコン（任意）</label>
          <input
            id="icon"
            name="icon"
            type="text"
            placeholder="例：🥛"
          />
        </div>

        <button type="submit">登録</button>
      </form>

      <p>
        <Link href="/categories">カテゴリー一覧に戻る</Link>
      </p>
    </main>
  );
}