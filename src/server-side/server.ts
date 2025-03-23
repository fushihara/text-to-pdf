import express from "express";
import { readFile } from "node:fs/promises";
const port = process.env.PORT || 59149;
const BASE_DIR = (() => {
  let dir = String(process.env.BASE_DIR ?? "/").trim();
  if (dir == "") {
    dir = "/";
  }
  if (dir.startsWith("/") && dir.endsWith("/")) {
    return dir;
  }
  throw new Error(`BASE_DIRは空文字かスラッシュで囲う必要があります`)
})();
const app = express();
const route = express.Router();
route.use((req, res, next) => {
  if (req.url.toLowerCase().endsWith(".html") || req.url.endsWith("/")) {
    next();
  } else {
    express.static("./.vite-output-dir")(req, res, next);
  }
});
route.get("/", async (req, res, next) => {
  const rawHtml = await readFile("./.vite-output-dir/index.html", { encoding: "utf-8" });
  const data = { data: "yes" };
  const responseHtml = rawHtml.replace("<!-- data -->", JSON.stringify(data));
  res.status(200).set({ 'Content-Type': 'text/html' }).send(responseHtml)
});
app.use(BASE_DIR, route);
app.get("/", (req, res, next) => {
  res.redirect(BASE_DIR);
})
app.listen(port, () => {
  console.log(`サーバー起動 http://localhost:${port}`)
});
