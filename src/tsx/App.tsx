import "./App.css"
import dateformat from "dateformat";
import { useEffect, useRef, useState } from "react"
import udevFont from "./assets/UDEVGothicJPDOC-Regular.ttf"
import { PDFDocument, rgb, PageSizes } from "pdf-lib"
import fontkit from '@pdf-lib/fontkit'

function App() {
  const [textAreaContent, setTextAreaContent] = useState("");
  const [fontSize, setFontSize] = useState('30');
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [fontBuffer, setFontBuffer] = useState<ArrayBuffer | null>(null);
  const [nowProcessing, setNowProcessing] = useState<boolean>(false);
  const timeoutRef = useRef<number>(null);
  useEffect(() => {
    // onload
    const urlKeyword = new URL(globalThis.document.URL).searchParams.get("kw") ?? "";
    const size = new URL(globalThis.document.URL).searchParams.get("size") ?? "30";
    setTextAreaContent(urlKeyword);
    setFontSize(size);
    fetch(udevFont).then(res => res.arrayBuffer()).then(setFontBuffer);
  }, [])
  useEffect(() => {
    setNowProcessing(true);
    if (globalThis.history) {
      const urlObj = new URL(globalThis.document.URL);
      urlObj.searchParams.delete("kw");
      urlObj.searchParams.delete("size");
      urlObj.searchParams.append("kw", textAreaContent);
      urlObj.searchParams.append("size", fontSize);
      history.pushState({}, "", urlObj.search);
    }
    if (fontBuffer == null) {
      return;
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      createPdf(fontBuffer, textAreaContent, Number(fontSize)).then(r => {
        const blob = new Blob([r], { type: "application/pdf" });
        setPdfBlob(blob);
        const objUrl = URL.createObjectURL(blob)
        setIframeUrl(objUrl);
        setNowProcessing(false);
      })
    }, 1000);
  }, [fontBuffer, textAreaContent, fontSize]);
  const sharePdf = () => {
    if (pdfBlob == null) {
      return;
    }
    const timestampStr = dateformat(new Date(), "yyyy-mmdd-HHMMss");
    const file = new File([pdfBlob], `text-${timestampStr}.pdf`, { type: pdfBlob.type });
    navigator.share({ files: [file] })
      .then(() => console.log("共有成功"))
      .catch(console.error);
  };
  return (
    <>
      <div className="container mx-auto px-5 py-10 max-w-xl">
        <h1>テキストをpdfに変換</h1>
        <textarea
          className="field-sizing-content reset w-full min-h-[220px] p-1"
          value={textAreaContent}
          onChange={e => setTextAreaContent(e.target.value)} // ... and update the state variable on any edits!
          disabled={fontBuffer == null}
        ></textarea>
        <div className="flex gap-2">
          <input
            className="flex-1"
            type="range"
            min={20}
            max={50}
            value={fontSize}
            step={1}
            onChange={e => setFontSize(e.target.value)}
          ></input>
          <span className="flex-none">val:{fontSize}</span>
        </div>
        <button
          className="reset w-full py-2"
          onClick={sharePdf}
          disabled={fontBuffer == null || nowProcessing}
        >pdfをシェア</button>
        {iframeUrl != "" && <iframe className="w-full h-fit" src={iframeUrl}></iframe>}
        <code>使用フォント：UDEVGothicJPDOC-Regular</code>
      </div >
    </>
  )
}

async function createPdf(fontBytes: ArrayBuffer, text: string, fontSize: number) {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const customFont = await pdfDoc.embedFont(fontBytes);
  let inputStr = text.trim();
  if (inputStr == "") {
    inputStr = "文字を入力して下さい"
  }
  const lineCount = inputStr.split(/\n/).length;
  const newHeight = (customFont.heightAtSize(fontSize) * lineCount) + fontSize * 0.5;
  const page = pdfDoc.addPage([PageSizes.A4[0], newHeight])
  const { width, height } = page.getSize()
  page.setHeight(newHeight);
  page.drawText(inputStr, {
    x: 0,
    y: newHeight - customFont.heightAtSize(fontSize),
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
    lineHeight: fontSize,
    maxWidth: width,
  });
  const pdfBytes = await pdfDoc.save()
  return pdfBytes;
}
export default App
