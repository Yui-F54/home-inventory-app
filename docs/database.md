# データベース設計書

## 変更履歴

| Ver. | 日付 | 変更内容 |
| --- | --- | --- |
| 1.0 | 2026/08/30 | 初版作成 |
| 1.1 | 2026/09/28 | 買い物項目テーブルの追加、カテゴリ・期限管理の仕様変更 |

---

## 1. テーブル一覧

| テーブル名 | 概要 | 主な関連機能 |
| --- | --- | --- |
| categories | 在庫品目のカテゴリを管理する | F001 / F004 / F011 |
| items | 家庭内の在庫品目を管理する | F001～F007 / F012 / F013 |
| shopping_items | 今回購入する買い物項目を管理する | F008 / F009 / F010 / F015 |

---

## 2. categories テーブル

在庫品目を分類するためのカテゴリを管理する。

| カラム名 | 型 | NULL | 概要 |
| --- | --- | --- | --- |
| id | Integer | NOT NULL | 主キー |
| name | String | NOT NULL | カテゴリ名 |
| icon | String | NOT NULL | カテゴリアイコン |
| createdAt | DateTime | NOT NULL | 作成日時 |
| updatedAt | DateTime | NOT NULL | 更新日時 |

### 補足

カテゴリ名には「食材」「日用品」「防災用品」などを登録する。

「未分類」というカテゴリデータは作成しない。

---

## 3. items テーブル

家庭内の在庫品目を管理する。

| カラム名 | 型 | NULL | 概要 |
| --- | --- | --- | --- |
| id | Integer | NOT NULL | 主キー |
| name | String | NOT NULL | 品目名 |
| quantity | Integer | NOT NULL | 現在の在庫数量 |
| unit | String | NOT NULL | 数量の単位 |
| minimumStock | Integer | NOT NULL | 最低在庫数 |
| expirationDate | DateTime | NULL | 期限日 |
| categoryId | Integer | NULL | categories.idへの外部キー |
| createdAt | DateTime | NOT NULL | 作成日時 |
| updatedAt | DateTime | NOT NULL | 更新日時 |

### 在庫不足判定

在庫不足はデータベースに専用の状態として保存せず、以下の条件から判定する。

    quantity <= minimumStock

在庫不足になっただけでは、買い物リストへ自動追加しない。

利用者が「買い物リストに追加」操作を行った場合に、shopping_itemsへ買い物項目を登録する。

### カテゴリ

categoryIdはNULLを許可する。

categoryIdがNULLの場合、画面上では「未分類」と表示する。

カテゴリを削除した場合、そのカテゴリに関連付けられているitemsのcategoryIdをNULLにする。

### 期限

expirationDateは任意項目とする。

「消費期限」「賞味期限」「使用期限」などの種類は保持せず、1つの期限日として管理する。

---

## 4. shopping_items テーブル

今回購入する買い物項目を管理する。

在庫品目と関連付けられた買い物項目と、在庫品目に関連付けられていない通常の買い物項目の両方を保存する。

| カラム名 | 型 | NULL | 概要 |
| --- | --- | --- | --- |
| id | Integer | NOT NULL | 主キー |
| name | String | NOT NULL | 買い物項目名 |
| quantity | Integer | NOT NULL | 購入数量 |
| isCompleted | Boolean | NOT NULL | 購入完了状態 |
| itemId | Integer | NULL | items.idへの外部キー |
| createdAt | DateTime | NOT NULL | 作成日時 |
| updatedAt | DateTime | NOT NULL | 更新日時 |

### 在庫品目との関連

itemIdがNULLでない場合、その買い物項目は在庫品目と関連付けられているものとする。

itemIdがNULLの場合、在庫管理されていない通常の買い物項目として扱う。

在庫不足品から「買い物リストに追加」操作を行った場合は、対象となるitems.idをitemIdへ設定する。

### 購入完了

在庫品目と関連付けられた買い物項目を購入完了にする場合は、以下の処理を行う。

1. shopping_items.quantityを対象items.quantityへ加算する
2. shopping_items.isCompletedをtrueにする

在庫品目と関連付けられていない場合は、在庫数量を変更せず、isCompletedのみtrueにする。

在庫数量の更新と購入完了状態の更新は、一連の処理として整合性を保つ。

購入完了後もshopping_itemsのレコードは削除せず、完了済み項目として保持する。

利用者が削除操作を行った場合にshopping_itemsから削除する。

---

## 5. テーブル間の関連

### categories と items

    categories
        1
        |
        | 0..N
        |
      items

1つのカテゴリには複数の在庫品目を関連付けることができる。

在庫品目はカテゴリを設定しなくてもよい。

### items と shopping_items

      items
        1
        |
        | 0..N
        |
    shopping_items

1つの在庫品目に複数の買い物項目を関連付けることができる。

shopping_items.itemIdはNULLを許可するため、在庫品目に関連付けられていない買い物項目も登録できる。

---

## 6. 削除時の扱い

### カテゴリ削除

カテゴリを削除しても在庫品目は削除しない。

関連するitems.categoryIdをNULLにする。

### 在庫品目削除

在庫品目を削除する場合、その品目に関連付けられているshopping_items自体は削除しない。

関連するshopping_items.itemIdをNULLにし、通常の買い物項目として残す。

---

## 7. 将来拡張

「いつか買いたいもの」を保存する機能は初期開発には含めない。

将来的には、今回購入するshopping_itemsとは別に、例えばwish_itemsのようなテーブルを追加することを検討する。

将来機能では、wish_itemsに保存された項目の中から今回購入するものを選択し、shopping_itemsへ追加する構成を想定する。

初期開発では、この将来機能のためだけのカラムやテーブルは追加しない。