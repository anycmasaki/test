# 採用テストコード
フォームに対して以下の要件でバリデーションを実装してください。
### 共通要件
* jQueryを使用
* バリデーションチェックのタイミング
  * フォームからフォーカスアウトした時
  * 「送信」ボタン押下時
* バリデーションエラー時の処理
  * フォームの枠線を赤(#f00)に、背景色をピンク(#fee)に
  * エラーの発生したフォームの下にエラーメッセージを赤字で表示
* バリデーション通過時のみ完了ページ（thanks.html）に遷移
### 各フォームのバリデーション
#### 氏名
* 必須
* 30文字以下
#### 電話番号
* ハイフンを含む半角数字
#### メールアドレス
* 必須
* メールアドレスの書式
#### 年代
* 必須
#### 得意な言語
* 必須
* 3つ以上選択
#### お問い合せ内容
* 5文字以上300文字以下




