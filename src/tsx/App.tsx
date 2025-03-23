import { useState } from "react"
import reactLogo from "./assets/react.svg"
import css from "./App.module.css"
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={`${import.meta.env.BASE_URL}vite.svg`} className={css["logo"]} alt="public-dir配下に設置されている画像" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className={`${css["logo"]} ${css["react"]}`} alt="importで読み込んだ画像" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={css["card"]}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className={css["read-the-docs"]}>
        viteロゴはpublic-dir。reactロゴはimport<br />
        BASE_URL:{import.meta.env.BASE_URL}
      </p>
    </>
  )
}

export default App
