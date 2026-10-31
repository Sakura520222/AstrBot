# Other plugin APIs

These examples belong inside a plugin's `Star` subclass.

## Get a platform instance

Use the current event's platform ID:

~~~python
from astrbot.api.event import AstrMessageEvent, filter
from astrbot.core.platform.sources.aiocqhttp.aiocqhttp_platform_adapter import (
    AiocqhttpAdapter,
)


@filter.command("platform_info")
async def platform_info(self, event: AstrMessageEvent):
    """Inspect the platform handling an event.

    Args:
        event: The incoming message event.
    """
    platform = self.context.get_platform_inst(event.get_platform_id())
    if isinstance(platform, AiocqhttpAdapter):
        client = platform.get_client()
~~~

Use the adapter type for the platform you are integrating with.

## Call OneBot APIs

For an `aiocqhttp` event, the event's bot client exposes the implementation's API:

~~~python
from astrbot.api import logger
from astrbot.core.platform.sources.aiocqhttp.aiocqhttp_message_event import (
    AiocqhttpMessageEvent,
)


@filter.command("delete_current_message")
async def delete_current_message(self, event: AstrMessageEvent):
    """Delete the current message using its platform implementation.

    Args:
        event: The incoming message event.
    """
    if event.get_platform_name() == "aiocqhttp":
        assert isinstance(event, AiocqhttpMessageEvent)
        result = await event.bot.api.call_action(
            "delete_msg", message_id=event.message_obj.message_id
        )
        logger.info("Message deletion result: %s", result)
~~~

See the [NapCat API](https://napcat.apifox.cn/) or [Lagrange API](https://lagrange-onebot.apifox.cn/) for implementation-specific methods.

## Loaded plugins and platforms

~~~python
plugins = self.context.get_all_stars()
platforms = self.context.platform_manager.get_insts()
~~~

Plugin entries are `StarMetadata` objects. Platform entries are the currently loaded platform instances.
