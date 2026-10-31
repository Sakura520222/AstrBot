from pathlib import Path

import click


def check_astrbot_root(path: str | Path) -> bool:
    """Check if the path is an AstrBot root directory"""
    if not isinstance(path, Path):
        path = Path(path)
    if not path.exists() or not path.is_dir():
        return False
    if not (path / ".astrbot").exists():
        return False
    return True


def get_astrbot_root() -> Path:
    """Get the AstrBot root directory path"""
    return Path.cwd()


async def check_dashboard(astrbot_root: Path) -> None:
    """Prepare version-matched WebUI assets for CLI startup.

    Args:
        astrbot_root: Instance data directory supplied by the CLI. Asset paths
            are resolved from the active runtime context.
    """
    from astrbot.core.updater import AstrBotUpdater

    try:
        dashboard_path = await AstrBotUpdater().ensure_dashboard()
        click.echo(f"Dashboard is ready at {dashboard_path}")
    except Exception as exc:
        click.echo(f"Failed to prepare Dashboard: {exc}")
