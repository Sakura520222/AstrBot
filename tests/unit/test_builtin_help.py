from unittest.mock import AsyncMock, MagicMock

import pytest

from astrbot.builtin_stars.builtin_commands.commands import help as help_module


@pytest.mark.asyncio
async def test_help_keeps_enabled_commands_and_local_documentation(monkeypatch):
    """Help must work from command metadata without a remote notice service."""
    monkeypatch.setattr(
        help_module, "get_dashboard_version", AsyncMock(return_value="v4.29.3")
    )
    monkeypatch.setattr(
        help_module.command_management,
        "list_commands",
        AsyncMock(
            return_value=[
                {
                    "reserved": True,
                    "enabled": True,
                    "effective_command": "renamed",
                    "description": "Enabled command",
                },
                {
                    "reserved": True,
                    "enabled": False,
                    "effective_command": "disabled",
                },
            ]
        ),
    )
    event = MagicMock()
    await help_module.HelpCommand(MagicMock()).help(event)
    result = event.set_result.call_args.args[0]
    text = "".join(component.text for component in result.chain)
    assert "/renamed" in text
    assert "/disabled" not in text
    assert "https://astrbot.pyabunny.com/docs/" in text
    assert result.use_t2i_ is False
