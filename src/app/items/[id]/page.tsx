import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ItemDetail from "./ItemDetail";

type ItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const { id } = await params;
  const itemId = Number(id);

  if (!Number.isInteger(itemId)) {
    notFound();
  }

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      category: true,
    },
  });

  if (!item) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  async function updateItem(formData: FormData) {
    "use server";

    const name = formData.get("name");
    const quantity = formData.get("quantity");
    const unit = formData.get("unit");
    const minimumStock = formData.get("minimumStock");
    const expirationDate = formData.get("expirationDate");
    const categoryId = formData.get("categoryId");

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("商品名は必須です。");
    }

    if (typeof unit !== "string" || unit.trim() === "") {
      throw new Error("単位は必須です。");
    }

    const quantityNumber = Number(quantity);
    const minimumStockNumber = Number(minimumStock);

    if (!Number.isInteger(quantityNumber) || quantityNumber < 0) {
      throw new Error("在庫数は0以上の整数で入力してください。");
    }

    if (
      !Number.isInteger(minimumStockNumber) ||
      minimumStockNumber < 0
    ) {
      throw new Error("最低在庫数は0以上の整数で入力してください。");
    }

    const expirationDateValue =
      typeof expirationDate === "string" && expirationDate !== ""
        ? new Date(expirationDate)
        : null;

    const categoryIdValue =
      typeof categoryId === "string" && categoryId !== ""
        ? Number(categoryId)
        : null;

    await prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        name: name.trim(),
        quantity: quantityNumber,
        unit: unit.trim(),
        minimumStock: minimumStockNumber,
        expirationDate: expirationDateValue,
        categoryId: categoryIdValue,
      },
    });

    redirect(`/items/${itemId}`);
  }

  return (
    <main>
      <ItemDetail
        item={{
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          minimumStock: item.minimumStock,
          expirationDate: item.expirationDate
            ? item.expirationDate.toISOString().slice(0, 10)
            : null,
          categoryId: item.categoryId,
          categoryName: item.category?.name ?? "未分類",
        }}
        categories={categories}
        updateItem={updateItem}
      />

      <p>
        <Link href="/items">在庫一覧に戻る</Link>
      </p>
    </main>
  );
}