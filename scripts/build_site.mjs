import { cp, mkdir, rm, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "site-dist");
const docs = join(root, "docs", ".vitepress", "dist");
if (relative(root, output) !== "site-dist") {
  throw new Error("The website output must remain inside this repository.");
}
await stat(join(docs, "index.html"));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(root, "site"), output, { recursive: true });
await cp(docs, join(output, "docs"), { recursive: true });
console.log("Website and documentation staged in site-dist/.");
