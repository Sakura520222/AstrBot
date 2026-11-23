"""PyaBot compatibility facade over the underlying ``astrbot`` runtime package.

Importing ``pyabot`` or any submodule under ``pyabot.*`` transparently aliases
the corresponding ``astrbot`` module so plugins written against either
``pyabot.api`` or ``astrbot.api`` share identical module objects, classes,
decorators, and runtime registries.
"""

from __future__ import annotations

import importlib
import importlib.abc
import importlib.machinery
import importlib.util
import sys
from types import ModuleType
from typing import Any

import astrbot as _astrbot

__version__: str = _astrbot.__version__
logger = _astrbot.logger


class _PyaBotAliasLoader(importlib.abc.Loader):
    """Loader that binds a ``pyabot.*`` import to its ``astrbot.*`` module."""

    def __init__(self, target_name: str) -> None:
        self._target_name = target_name

    def create_module(self, spec: importlib.machinery.ModuleSpec) -> ModuleType:
        target = importlib.import_module(self._target_name)
        sys.modules[spec.name] = target
        return target

    def exec_module(self, module: ModuleType) -> None:
        return None


class _PyaBotAliasFinder(importlib.abc.MetaPathFinder):
    """Meta-path finder redirecting ``pyabot.*`` imports to ``astrbot.*``."""

    def find_spec(
        self,
        fullname: str,
        path: Any = None,
        target: ModuleType | None = None,
    ) -> importlib.machinery.ModuleSpec | None:
        if not fullname.startswith("pyabot.") or fullname == "pyabot.__main__":
            return None

        target_name = "astrbot." + fullname.removeprefix("pyabot.")
        target_spec = importlib.util.find_spec(target_name)
        if target_spec is None:
            return None

        spec = importlib.machinery.ModuleSpec(
            name=fullname,
            loader=_PyaBotAliasLoader(target_name),
            origin=target_spec.origin,
            is_package=target_spec.submodule_search_locations is not None,
        )
        if target_spec.submodule_search_locations is not None:
            spec.submodule_search_locations = list(
                target_spec.submodule_search_locations
            )
        return spec


def _install_alias_finder() -> None:
    """Register the ``pyabot.*`` import alias finder once in ``sys.meta_path``."""
    if not any(isinstance(finder, _PyaBotAliasFinder) for finder in sys.meta_path):
        sys.meta_path.insert(0, _PyaBotAliasFinder())


_install_alias_finder()


def __getattr__(name: str) -> Any:
    """Forward attribute lookups to the underlying ``astrbot`` package."""
    return getattr(_astrbot, name)


def __dir__() -> list[str]:
    return sorted(set(globals()) | set(dir(_astrbot)))
