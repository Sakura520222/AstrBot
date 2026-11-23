import asyncio
import os
from pathlib import Path

import click
from filelock import FileLock, Timeout

PYABOT_DASHBOARD_INITIAL_PASSWORD_ENV = "PYABOT_DASHBOARD_INITIAL_PASSWORD"
DASHBOARD_INITIAL_PASSWORD_ENV = "ASTRBOT_DASHBOARD_INITIAL_PASSWORD"


def _initialize_config_from_env(astrbot_root: Path) -> None:
    if (
        PYABOT_DASHBOARD_INITIAL_PASSWORD_ENV not in os.environ
        and DASHBOARD_INITIAL_PASSWORD_ENV not in os.environ
    ):
        return

    from astrbot.core.config.astrbot_config import AstrBotConfig

    AstrBotConfig(config_path=str(astrbot_root / "data" / "cmd_config.json"))
    click.echo("Initialized data/cmd_config.json with dashboard initial password.")


async def initialize_astrbot(astrbot_root: Path, yes: bool = False) -> None:
    """Execute PyaBot initialization logic.

    Args:
        astrbot_root: PyaBot root directory path.
        yes: Whether to skip the installation confirmation.
    """
    dot_pyabot = astrbot_root / ".pyabot"
    dot_astrbot = astrbot_root / ".astrbot"

    if not dot_pyabot.exists() and not dot_astrbot.exists():
        if yes or click.confirm(
            f"Install PyaBot to this directory? {astrbot_root}",
            default=True,
            abort=True,
        ):
            dot_pyabot.touch()
            click.echo(f"Created {dot_pyabot}")

    paths = {
        "data": astrbot_root / "data",
        "config": astrbot_root / "data" / "config",
        "plugins": astrbot_root / "data" / "plugins",
        "temp": astrbot_root / "data" / "temp",
    }

    for name, path in paths.items():
        path.mkdir(parents=True, exist_ok=True)
        click.echo(f"{'Created' if not path.exists() else 'Directory exists'}: {path}")

    _initialize_config_from_env(astrbot_root)


@click.command()
@click.option("--yes", "-y", is_flag=True, help="Skip confirmation prompts")
def init(yes: bool) -> None:
    """Initialize PyaBot.

    Args:
        yes: Whether to skip confirmation prompts.
    """
    from ..utils import get_astrbot_root

    click.echo("Initializing PyaBot...")

    astrbot_root = get_astrbot_root()
    lock_file = astrbot_root / "pyabot.lock"
    lock = FileLock(lock_file, timeout=5)

    try:
        with lock.acquire():
            asyncio.run(initialize_astrbot(astrbot_root, yes=yes))
            click.echo("Done! You can now run 'pyabot run' to start PyaBot")
    except Timeout:
        raise click.ClickException(
            "Cannot acquire lock file. Please check if another instance is running"
        )

    except Exception as e:
        raise click.ClickException(f"Initialization failed: {e!s}")
