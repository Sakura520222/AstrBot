"""Unit tests for PyaBot branding and AstrBot plugin compatibility."""

from __future__ import annotations

import json
from pathlib import Path

import yaml

import astrbot
import pyabot
from astrbot.cli.utils.basic import check_astrbot_root
from astrbot.core.star.star_manager import PluginManager
from astrbot.core.utils.astrbot_path import get_astrbot_root


def test_pyabot_import_facade_aliases_astrbot_modules():
    """Imports under pyabot.* must resolve to the exact astrbot.* module objects."""
    import astrbot.api as astrbot_api
    import astrbot.api.star as astrbot_star
    import astrbot.core.utils.astrbot_path as astrbot_path_mod
    import pyabot.api as pyabot_api
    from pyabot.api import star as pyabot_star
    from pyabot.api.star import Context, Star, register
    from pyabot.core.utils import astrbot_path as pyabot_path_mod

    assert pyabot.__version__ == astrbot.__version__
    assert pyabot.logger is astrbot.logger
    assert pyabot_api is astrbot_api
    assert pyabot_star is astrbot_star
    assert Star is astrbot_star.Star
    assert Context is astrbot_star.Context
    assert register is astrbot_star.register
    assert pyabot_path_mod is astrbot_path_mod


def test_pyabot_root_env_prefers_pyabot_and_falls_back_to_astrbot(
    monkeypatch,
    tmp_path: Path,
):
    """PYABOT_ROOT takes precedence while ASTRBOT_ROOT remains supported."""
    pyabot_dir = tmp_path / "pyabot-root"
    astrbot_dir = tmp_path / "astrbot-root"
    pyabot_dir.mkdir()
    astrbot_dir.mkdir()

    monkeypatch.delenv("PYABOT_ROOT", raising=False)
    monkeypatch.setenv("ASTRBOT_ROOT", str(astrbot_dir))
    assert get_astrbot_root() == str(astrbot_dir.resolve())

    monkeypatch.setenv("PYABOT_ROOT", str(pyabot_dir))
    assert get_astrbot_root() == str(pyabot_dir.resolve())


def test_cli_root_check_accepts_pyabot_and_legacy_astrbot_markers(tmp_path: Path):
    """Both .pyabot and legacy .astrbot marker files must be recognized."""
    pyabot_root = tmp_path / "new-instance"
    pyabot_root.mkdir()
    assert not check_astrbot_root(pyabot_root)
    (pyabot_root / ".pyabot").touch()
    assert check_astrbot_root(pyabot_root)

    legacy_root = tmp_path / "legacy-instance"
    legacy_root.mkdir()
    (legacy_root / ".astrbot").touch()
    assert check_astrbot_root(legacy_root)


def test_plugin_metadata_supports_pyabot_and_astrbot_version_and_i18n(tmp_path: Path):
    """Plugins may declare pyabot_version or astrbot_version and either i18n dir."""
    pyabot_plugin = tmp_path / "pyabot_plugin"
    (pyabot_plugin / ".pyabot-plugin" / "i18n").mkdir(parents=True)
    (pyabot_plugin / ".pyabot-plugin" / "i18n" / "zh-CN.json").write_text(
        json.dumps({"hello": "pya"}), encoding="utf-8"
    )
    (pyabot_plugin / "metadata.yaml").write_text(
        yaml.safe_dump(
            {
                "name": "pyabot_plugin",
                "desc": "PyaBot native plugin",
                "author": "Sakura520222",
                "version": "1.0.0",
                "pyabot_version": ">=4.0,<5.0",
            }
        ),
        encoding="utf-8",
    )

    loaded_pyabot = PluginManager._load_plugin_metadata(str(pyabot_plugin))
    assert loaded_pyabot is not None
    assert loaded_pyabot.astrbot_version == ">=4.0,<5.0"
    assert loaded_pyabot.i18n == {"zh-CN": {"hello": "pya"}}
    assert PluginManager._validate_astrbot_version_specifier(
        loaded_pyabot.astrbot_version
    ) == (True, None)

    legacy_plugin = tmp_path / "legacy_plugin"
    (legacy_plugin / ".astrbot-plugin" / "i18n").mkdir(parents=True)
    (legacy_plugin / ".astrbot-plugin" / "i18n" / "en-US.json").write_text(
        json.dumps({"hello": "astr"}), encoding="utf-8"
    )
    (legacy_plugin / "metadata.yaml").write_text(
        yaml.safe_dump(
            {
                "name": "legacy_plugin",
                "desc": "Legacy AstrBot plugin",
                "author": "AstrBotDevs",
                "version": "1.0.0",
                "astrbot_version": ">=4.0,<5.0",
            }
        ),
        encoding="utf-8",
    )

    loaded_legacy = PluginManager._load_plugin_metadata(str(legacy_plugin))
    assert loaded_legacy is not None
    assert loaded_legacy.astrbot_version == ">=4.0,<5.0"
    assert loaded_legacy.i18n == {"en-US": {"hello": "astr"}}
    assert PluginManager._validate_astrbot_version_specifier(
        loaded_legacy.astrbot_version
    ) == (True, None)
