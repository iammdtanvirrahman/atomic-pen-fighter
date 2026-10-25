import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const generatedCopies = [
  ["src/styles/game.css", "public/css/game.css"],
  ["src/styles/game.css", "android/app/src/main/assets/www/css/game.css"],
  ["src/pwa/install.js", "public/js/pwa-install.js"],
];

for (const [sourcePath, destinationPath] of generatedCopies) {
  const source = resolve(root, sourcePath);
  const destination = resolve(root, destinationPath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  console.log(`Synced ${sourcePath} -> ${destinationPath}`);
}

console.log("Shared assets synced. Platform-specific game bundles were left untouched.");
