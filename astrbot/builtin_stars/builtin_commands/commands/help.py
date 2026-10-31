from astrbot.api import star
from astrbot.api.event import AstrMessageEvent, MessageEventResult
from astrbot.core.config.default import VERSION
from astrbot.core.dashboard_assets import get_dashboard_version
from astrbot.core.star import command_management


class HelpCommand:
    def __init__(self, context: star.Context) -> None:
        self.context = context

    async def _build_reserved_command_lines(self) -> list[str]:
        """
        使用实时指令配置生成内置指令清单，确保重命名/禁用后与实际生效状态保持一致。
        """
        try:
            commands = await command_management.list_commands()
        except BaseException:
            return []

        lines: list[str] = []

        def walk(items: list[dict], indent: int = 0) -> None:
            for item in items:
                if not item.get("reserved") or not item.get("enabled"):
                    continue
                # 仅展示顶级指令或指令组
                if item.get("type") == "sub_command":
                    continue
                if item.get("parent_signature"):
                    continue

                effective = (
                    item.get("effective_command")
                    or item.get("original_command")
                    or item.get("handler_name")
                )
                if not effective or effective in [
                    "set",
                    "unset",
                    "help",
                    "dashboard_update",
                ]:
                    continue

                description = item.get("description") or ""
                desc_text = f" - {description}" if description else ""
                indent_prefix = "  " * indent
                lines.append(f"{indent_prefix}/{effective}{desc_text}")

        walk(commands)
        return lines

    async def help(self, event: AstrMessageEvent) -> None:
        """Show enabled built-in commands and the documentation entry point.

        Args:
            event: Incoming event receiving the help result.
        """

        dashboard_version = await get_dashboard_version()
        command_lines = await self._build_reserved_command_lines()
        commands_section = (
            "\n".join(command_lines)
            if command_lines
            else "No enabled built-in commands."
        )

        msg_parts = [
            f"AstrBot v{VERSION}(WebUI: {dashboard_version})",
            commands_section,
            "文档：https://astrbot.pyabunny.com/docs/",
        ]
        msg = "\n".join(msg_parts)

        event.set_result(MessageEventResult().message(msg).use_t2i(False))
