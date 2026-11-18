import { cp, copyFile, mkdir, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "site-dist");
const built = join(root, "docs", ".vitepress", "dist");
if (relative(root, output) !== "site-dist") {
  throw new Error("The website output must remain inside this repository.");
}
for (const page of ["index.html", "404.html", "docs/index.html", "docs/en/index.html"]) {
  await stat(join(built, page));
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(built, output, { recursive: true });

// Preserve the public asset URLs served under the former VitePress base.
await cp(join(root, "docs", "public"), join(output, "docs"), {
  recursive: true,
  filter: source => !["robots.txt", "_headers"].includes(basename(source)),
});
await copyFile(join(output, "sitemap.xml"), join(output, "docs", "sitemap.xml"));
await writeFile(join(output, "releases.json"), "[]\n");
console.log("VitePress website staged in site-dist/.");
