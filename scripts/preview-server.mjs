// Dev-only static preview server for trainer.html (used by the editor's preview panel).
// NOT part of the product: the app itself runs offline from file:// with zero dependencies.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8931;
const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".json": "application/json"
};

http.createServer((req, res) => {
  const url = req.url === "/" ? "/trainer.html" : decodeURIComponent(req.url.split("?")[0]);
  const file = path.resolve(path.join(ROOT, url));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end("not found"); return;
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
}).listen(PORT, () => console.log(`preview serving ${ROOT} on http://localhost:${PORT}`));
