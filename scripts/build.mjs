import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Keep source CSS in ordered modules, but emit one production stylesheet so
// mobile browsers don't need to request multiple CSS files.
const styleParts = [
  "src/styles/00-core.css",
  "src/styles/10-visual-redesign.css",
  "src/styles/20-table-ratio.css",
  "src/styles/30-minimal-hud.css",
  "src/styles/40-asset-free.css",
];

const css = (await Promise.all(
  styleParts.map((file) => readFile(resolve(root, file), "utf8"))
)).join("");

const generatedCss = [
  "public/css/game.css",
  "android/app/src/main/assets/www/css/game.css",
];

for (const file of generatedCss) {
  const destination = resolve(root, file);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, css, "utf8");
  console.log(`Built ${file} from ${styleParts.length} ordered CSS modules`);
}

const source = resolve(root, "src/pwa/install.js");
const destination = resolve(root, "public/js/pwa-install.js");
await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
console.log("Synced src/pwa/install.js -> public/js/pwa-install.js");

console.log("Platform-specific game bundles were left untouched.");
