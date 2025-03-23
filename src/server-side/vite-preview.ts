/**
 * node --experimental-strip-types --watch-path=./src  src\server-side\vite-preview.ts
 */
import { build, preview } from "vite"
await build();
const previewServer = await preview()

previewServer.printUrls();
previewServer.bindCLIShortcuts({ print: true });
