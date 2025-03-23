# about
Phomemo用のテキストpdf化ツール。

- PCでプリントしたい文字を入力する
- chromeの「デバイスに送る」でスマホに転送
- スマホで開くとテキストやサイズが入力済みになってる
- pdfをシェアを押すと共有ダイアログが表示される
- Phomemo のアプリを選ぶ
- アプリで印刷する

これでスマホ側の作業を最小化してプリントする事が可能。特に文字入力はPCで行いたかった。

# 実行コマンド
ローカルでwatchしながらpreview
> node --experimental-strip-types --watch-path=./src ./src/server-side/vite-preview.ts

デプロイ用ファイル作成コマンド
> npx vite build

# Warning！
このレポジトリは公開しているので注意！
