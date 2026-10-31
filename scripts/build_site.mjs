import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
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
await writeFile(join(output, "releases.json"), "[]\n");
const packageSource = await readFile(
  join(root, "astrbot", "__init__.py"),
  "utf8",
);
const version = packageSource.match(
  /^__version__\s*=\s*["']([^"']+)["']/m,
)?.[1];
if (!version) throw new Error("AstrBot version is missing.");
const stylesheet = await readFile(join(output, "styles.css"));
const stylesheetName = `styles.${createHash("sha256")
  .update(stylesheet)
  .digest("hex")
  .slice(0, 12)}.css`;
await writeFile(join(output, stylesheetName), stylesheet);
for (const filename of ["index.html", "404.html"]) {
  const file = join(output, filename);
  const html = await readFile(file, "utf8");
  await writeFile(
    file,
    html
      .replaceAll('href="/styles.css"', `href="/${stylesheetName}"`)
      .replaceAll("{{version}}", version),
  );
}
console.log("Website and documentation staged in site-dist/.");
