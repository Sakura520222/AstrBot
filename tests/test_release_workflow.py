import json
import os
import re
import shutil
import subprocess
import zipfile
from pathlib import Path

import pytest
import yaml

from astrbot.core import dashboard_assets
from astrbot.core.updater import AstrBotUpdater

ROOT = Path(__file__).resolve().parents[1]


@pytest.mark.asyncio
async def test_release_archives_match_runtime_download_names(monkeypatch, tmp_path):
    """Fresh installs and updates must download exactly the archives built by CI."""
    workflow = yaml.safe_load((ROOT / ".github/workflows/release.yml").read_text())
    step = next(
        item
        for item in workflow["jobs"]["release"]["steps"]
        if item.get("name") == "Build source and WebUI archives"
    )
    archives = set(
        re.findall(r"[A-Za-z]+-\$\{RELEASE_TAG\}-(?:core|dashboard)\.zip", step["run"])
    )
    assert len(archives) == 2
    tag = "v9.9.9"
    calls: list[str] = []

    async def fake_download_file(url: str, path: str, **_kwargs) -> None:
        calls.append(url)
        with zipfile.ZipFile(path, "w") as archive:
            archive.writestr("dist/index.html", "dashboard")

    monkeypatch.delenv("PYABOT_CORE_PACKAGE_BASE_URL", raising=False)
    monkeypatch.delenv("ASTRBOT_CORE_PACKAGE_BASE_URL", raising=False)
    monkeypatch.setattr(dashboard_assets, "download_file", fake_download_file)

    await dashboard_assets._download_package(
        path=str(tmp_path / "dashboard.zip"), version=tag, extract=False
    )
    core_url = AstrBotUpdater()._build_core_package_url(tag)

    downloaded = {url.rsplit("/", 1)[-1] for url in [*calls, core_url]}
    assert downloaded == {name.replace("${RELEASE_TAG}", tag) for name in archives}


def test_website_feed_exports_only_public_release_fields(tmp_path, monkeypatch):
    """The deployed feed must exclude drafts and private GitHub metadata."""
    workflow = yaml.safe_load((ROOT / ".github/workflows/build-docs.yml").read_text())
    step = next(
        item
        for item in workflow["jobs"]["docs"]["steps"]
        if item.get("name") == "Generate public release feed"
    )
    script = step["run"].split("python - <<'PY'\n", 1)[1].rsplit("\nPY", 1)[0]
    (tmp_path / "site-dist").mkdir()
    (tmp_path / "release-pages.json").write_text(
        json.dumps(
            [
                [
                    {
                        "draft": False,
                        "name": None,
                        "tag_name": "v4.29.3",
                        "published_at": "2026-10-30T18:13:51Z",
                        "body": None,
                        "prerelease": False,
                        "author": {"private_field": "not-public"},
                    },
                    {
                        "draft": True,
                        "body": "private draft notes",
                    },
                ]
            ]
        )
    )
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv("GH_REPO", "Sakura520222/PyaBot")
    exec(compile(script, "workflow-release-feed", "exec"), {})
    feed = json.loads((tmp_path / "site-dist/releases.json").read_text())
    assert feed == [
        {
            "name": "v4.29.3",
            "tag_name": "v4.29.3",
            "published_at": "2026-10-30T18:13:51Z",
            "body": "",
            "zipball_url": "https://github.com/Sakura520222/PyaBot/archive/refs/tags/v4.29.3.zip",
            "prerelease": False,
        }
    ]


def test_published_release_cannot_upload_or_replace_assets(tmp_path):
    """A rerun must stop before any mutation of a published release."""
    bash = shutil.which("bash")
    if bash is None:
        candidate = Path(os.environ.get("ProgramFiles", "C:/Program Files")) / "Git/bin/bash.exe"
        if candidate.is_file():
            bash = str(candidate)
    if bash is None:
        pytest.skip("Bash is required to validate the release publisher.")
    workflow = yaml.safe_load((ROOT / ".github/workflows/release.yml").read_text())
    publish = next(
        item
        for item in workflow["jobs"]["release"]["steps"]
        if item.get("name") == "Publish GitHub Release"
    )
    mock = """
gh() {
  if [[ "$1 $2" == "release view" ]]; then
    echo false
    return 0
  fi
  echo "$*" >> mutations.txt
}
"""
    result = subprocess.run(
        [bash, "-e", "-c", mock + publish["run"]],
        cwd=tmp_path,
        env=os.environ
        | {
            "RELEASE_TAG": "v4.29.3",
            "GH_REPO": "local-test/unused",
            "GH_TOKEN": "local-test-not-a-token",
        },
        capture_output=True,
        text=True,
    )
    assert result.returncode != 0
    assert "already public" in result.stdout
    assert not (tmp_path / "mutations.txt").exists()
