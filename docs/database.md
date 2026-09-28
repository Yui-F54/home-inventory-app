# データベース設計

## 1. テーブル一覧

| No. | テーブル名 | 用途 | 関連機能 |
| --- | --- | --- | --- |
| 1 | items | 品目の基本情報、現在数量、単位、最低在庫数などを管理する | F001〜F010 |
| 2 | categories | 品目を分類するカテゴリを管理する | F001 / F004 / F011 |

---

## 2. categories テーブル

カテゴリ情報を管理する。

| カラム名 | 内容 | 備考 |
| --- | --- | --- |
| id | カテゴリID | 主キー |
| name | カテゴリ名 |  |
| createdAt | 作成日時 |  |
| updatedAt | 更新日時 |  |

---

## 3. items テーブル

在庫品目の情報を管理する。

| カラム名 | 内容 | 備考 |
| --- | --- | --- |
| id | 品目ID | 主キー |
| name | 品目名 |  |
| quantity | 現在の在庫数量 |  |
| unit | 単位 | 例：個、本、袋 |
| minimumStock | 最低在庫数 | 在庫不足判定に使用 |
| categoryId | カテゴリID | 外部キー |
| createdAt | 作成日時 |  |
| updatedAt | 更新日時 |  |

---

## 4. テーブル間の関係

`categories` と `items` は 1対多（1:N）の関係とする。

1つのカテゴリには複数の品目を登録できる。

    categories
    -----------
    id PK
    name
    createdAt
    updatedAt

         1
         |
         |
         N

    items
    -----------
    id PK
    name
    quantity
    unit
    minimumStock
    categoryId FK
    createdAt
    updatedAt

---

## 5. 在庫不足判定

現在の在庫数量が最低在庫数以下になった場合、その品目を在庫不足と判定する。

    quantity <= minimumStock

在庫不足となった品目は、買い物対象として扱う。