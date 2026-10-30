from pathlib import Path

import pytest

from astrbot.core import dashboard_assets
from astrbot.core import updater as core_updater
from astrbot.core.config import VERSION


@pytest.mark.parametrize("distribution", [None, "AstrBotDevs/AstrBot"])
def test_upstream_assets_with_the_same_version_are_not_fork_assets(
    tmp_path: Path, distribution: str | None
):
    assets = tmp_path / "assets"
    assets.mkdir()
    (tmp_path / "index.html").write_text('<script src="/assets/app.js"></script>')
    (assets / "app.js").write_text("export {};")
    (assets / "version").write_text(f"v{VERSION}")
    if distribution is not None:
        (assets / "distribution").write_text(distribution)
    assert not dashboard_assets._is_dist_compatible(tmp_path, VERSION)
    (assets / "distribution").write_text("Sakura520222/AstrBot")
    assert dashboard_assets._is_dist_compatible(tmp_path, VERSION)


@pytest.mark.asyncio
async def test_same_version_upstream_assets_trigger_a_fork_download(
    monkeypatch, tmp_path: Path
):
    dist = tmp_path / "dist"
    assets = dist / "assets"
    assets.mkdir(parents=True)
    (dist / "index.html").write_text('<script src="/assets/app.js"></script>')
    (assets / "app.js").write_text("export {};")
    (assets / "version").write_text(f"v{VERSION}")
    calls = []

    async def download(**kwargs):
        calls.append(kwargs)
        (assets / "distribution").write_text("Sakura520222/AstrBot")

    monkeypatch.setattr(core_updater, "get_astrbot_data_path", lambda: str(tmp_path))
    monkeypatch.setattr(
        core_updater, "_get_bundled_dist_path", lambda: tmp_path / "missing"
    )
    monkeypatch.setattr(core_updater, "_should_use_bundled_dist", lambda *_: False)
    monkeypatch.setattr(core_updater, "_download_package", download)
    assert await core_updater.AstrBotUpdater().ensure_dashboard() == dist
    assert calls == [
        {"version": f"v{VERSION}", "allow_insecure_ssl_fallback": False}
    ]
