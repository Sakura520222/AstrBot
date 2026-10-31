"""Validate links, anchors, and assets in the generated website."""

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

sys.stdout.reconfigure(encoding="utf-8")


class PageLinks(HTMLParser):
    """Collect static links and anchor identifiers from an HTML page."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.anchors: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        """Read link targets and named anchors.

        Args:
            tag: HTML element name.
            attrs: Element attributes supplied by the parser.
        """
        for name, value in attrs:
            if not value:
                continue
            if name == "id" or (tag == "a" and name == "name"):
                self.anchors.add(value)
            if name in {"href", "src", "poster"}:
                self.links.append(value)


root = Path(sys.argv[1] if len(sys.argv) > 1 else "site-dist").resolve()
if not (root / "index.html").is_file():
    raise SystemExit("The website root must contain index.html.")
pages: dict[Path, PageLinks] = {}
links: list[tuple[Path, str]] = []
for path in root.rglob("*.html"):
    page = PageLinks()
    page.feed(path.read_text(encoding="utf-8"))
    pages[path] = page
    links.extend((path, url) for url in page.links)
for path in root.rglob("*.css"):
    for match in re.finditer(
        r"url\(\s*['\"]?([^)'\"\s]+)", path.read_text(encoding="utf-8")
    ):
        links.append((path, match.group(1)))

project = Path(__file__).resolve().parents[1]
sources = [project / "README.md", project / "README_zh.md", project / "pyproject.toml"]
sources.extend(project.glob("FIRST_NOTICE*.md"))
for folder in ("astrbot", "dashboard/src", ".github/ISSUE_TEMPLATE"):
    sources.extend(
        path
        for path in (project / folder).rglob("*")
        if path.is_file()
        and path.suffix in {".py", ".ts", ".js", ".vue", ".json", ".yml", ".md"}
    )
for path in sources:
    for match in re.finditer(
        r"https://astrbot\.pyabunny\.com/[^\s<>\"'`)\]\\]*",
        path.read_text(encoding="utf-8"),
    ):
        links.append((path, match.group(0).rstrip(".,;:!?，。；：！？）】")))

errors = set()
checked = 0
directory_entries: dict[Path, set[str]] = {}
for source, url in links:
    source_name = (
        source.relative_to(root).as_posix()
        if source.is_relative_to(root)
        else source.relative_to(project).as_posix()
    )
    parsed = urlsplit(urljoin("https://astrbot.pyabunny.com/" + source_name, url))
    if (
        parsed.scheme not in {"http", "https"}
        or parsed.netloc != "astrbot.pyabunny.com"
    ):
        continue
    checked += 1
    target = (root / unquote(parsed.path).lstrip("/")).resolve()
    if not target.is_relative_to(root):
        errors.add((source_name, url, "outside website root"))
        continue
    candidates = [target]
    if not target.suffix:
        candidates.extend([target.with_suffix(".html"), target / "index.html"])
    if target.is_dir():
        candidates.insert(0, target / "index.html")
    destination = next((item for item in candidates if item.is_file()), None)
    if destination is None:
        errors.add((source_name, url, "missing target"))
        continue
    current = root
    for part in destination.relative_to(root).parts:
        if current not in directory_entries:
            directory_entries[current] = {item.name for item in current.iterdir()}
        if part not in directory_entries[current]:
            errors.add((source_name, url, "filename case mismatch"))
            break
        current = current / part
    fragment = unquote(parsed.fragment)
    if fragment and destination in pages and fragment not in pages[destination].anchors:
        errors.add((source_name, url, "missing anchor"))

for source, url, reason in sorted(errors):
    print(f"{source}: {url} ({reason})")
print(
    f"Checked {len(pages)} HTML pages and {checked} internal links/assets; {len(errors)} errors."
)
raise SystemExit(bool(errors))
