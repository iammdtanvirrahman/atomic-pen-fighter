import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

async function read(relativePath) {
  try {
    return await readFile(resolve(root, relativePath), "utf8");
  } catch {
    failures.push(`Missing or unreadable file: ${relativePath}`);
    return "";
  }
}

async function exists(relativePath) {
  try {
    await stat(resolve(root, relativePath));
    return true;
  } catch {
    failures.push(`Missing required path: ${relativePath}`);
    return false;
  }
}

const requiredPaths = [
  "index.html",
  "server.js",
  "public/index.html",
  "public/css/game.css",
  "public/js/pen-game.bundle.js",
  "public/js/pwa-install.js",
  "public/sw.js",
  "public/manifest.webmanifest",
  "src/styles/game.css",
  "src/pwa/install.js",
  "android/settings.gradle",
  "android/app/src/main/assets/www/index.html",
  "android/app/src/main/assets/www/css/game.css",
  "android/app/src/main/assets/www/js/pen-game.bundle.js",
];

for (const path of requiredPaths) await exists(path);

const [rootHtml, webHtml, androidHtml, sourceCss, webCss, androidCss, sourcePwa, webPwa] =
  await Promise.all([
    read("index.html"),
    read("public/index.html"),
    read("android/app/src/main/assets/www/index.html"),
    read("src/styles/game.css"),
    read("public/css/game.css"),
    read("android/app/src/main/assets/www/css/game.css"),
    read("src/pwa/install.js"),
    read("public/js/pwa-install.js"),
  ]);

const references = [
  [rootHtml, "./public/css/game.css", "root HTML stylesheet"],
  [rootHtml, "./public/js/pen-game.bundle.js", "root HTML game bundle"],
  [rootHtml, "./public/js/pwa-install.js", "root HTML install script"],
  [webHtml, "./css/game.css", "web HTML stylesheet"],
  [webHtml, "./js/pen-game.bundle.js", "web HTML game bundle"],
  [webHtml, "./js/pwa-install.js", "web HTML install script"],
  [androidHtml, "./css/game.css", "Android HTML stylesheet"],
  [androidHtml, "./js/pen-game.bundle.js", "Android HTML game bundle"],
];

for (const [html, reference, label] of references) {
  if (!html.includes(reference)) failures.push(`Broken or missing ${label} reference: ${reference}`);
}

if (androidHtml.includes("pwa-install.js")) {
  failures.push("Android HTML should not load the browser PWA-install banner script.");
}
if (sourceCss !== webCss) failures.push("public/css/game.css is out of sync; run npm run build.");
if (sourceCss !== androidCss) failures.push("Android game.css is out of sync; run npm run build.");
if (sourcePwa !== webPwa) failures.push("public/js/pwa-install.js is out of sync; run npm run build.");

for (const bundlePath of [
  "public/js/pen-game.bundle.js",
  "android/app/src/main/assets/www/js/pen-game.bundle.js",
]) {
  try {
    const details = await stat(resolve(root, bundlePath));
    if (details.size < 500_000) failures.push(`Unexpectedly small game bundle: ${bundlePath}`);
  } catch {
    // The missing-path check above reports this as well.
  }
}

if (failures.length) {
  console.error("\nProject checks failed:");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Project checks passed: required files, deployment references, shared copies, and game bundles are present.");
}
