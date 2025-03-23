#  概要
nodejs、vite、reactでSSRをする方法。
reactのコンポーネントはちゃんとjavascriptも動く。
## 環境変数
BASE_DIRで基準点の指定可能。
未指定、空文字、先頭と末尾が`/`の文字列 が指定可能。

## ビルド方法

```
set BASE_DIR=/test/
npm run build:client
npm run start-server
```

# 出来ない点
reactコンポーネントの中で、サーバー側で処理を動かす事は出来ない。
1つのtsxファイルの中で、DBからデータを持ってくる処理をサーバーサイドのみ指定で動かしてという事は出来ない。

それだとサーバーサイドレンダリングの利点が半分くらいになってる気もする。
複雑なレイアウトで一瞬白い画面が出る事すら許容したくないならいいかもしれんが。

## Denoを使わない理由
- vite のサポートが完全ではなく、nodeのpackage.jsonやnode_modulesが必要そうだから。
- tsxの中で`import img from "./image.jpg"`がvscodeで型エラーになるのを止められないから。

# vite
`vite.transformIndexHtml(url,templateHtmlString)`
htmlファイルの中のvite用のjavascriptを直に埋め込んだりする
ホットリロード用でこれをコメントアウトしても動いたので、不要かもしれない。
もちろんその場合ホットリロードは機能しなくなる。
それでもwebsocketは生えててメッセージ受信してるのが気になる

`vite.ssrLoadModule(tsxFilePath)`
tsxファイルのデフォルト エクスポートしたreactのHTMLエレメントからレンダリング用関数を作る。
tsxファイルのパスを文字列で決め打ちするのが気に入らないが、
ts-nodeが`import .svg`などのアセットインポートを理解できないから仕方ない？

`ReactDOM.hydrateRoot(domElement,<App/>)`
クライアント側で動かす。SSRされたhtmlの中にReactのHTMLエレメントをインジェクトする

`ReactDOMServer.renderToString(<App/>)`
サーバー側で動かす。SSRの要か

viteから実行した時やviteでビルドした時、`import.meta.env.BASE_URL`などの変数が使える。
ts-nodeでexpressを直に動かした時は効かないので注意。
あるプロパティは`BASE_URL MODE`のstring形、`DEV PROD SSR`のbool方。
