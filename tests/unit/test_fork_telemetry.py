import aiohttp
import pytest

from astrbot.core.utils.metrics import Metric


@pytest.mark.asyncio
async def test_fork_never_submits_telemetry_upstream(monkeypatch):
    def forbidden_session(*args, **kwargs):
        raise AssertionError("The fork must not create an upstream telemetry request")

    monkeypatch.setattr(aiohttp, "ClientSession", forbidden_session)
    monkeypatch.setattr(Metric, "_is_disabled", staticmethod(lambda: False))
    await Metric._post_metrics({"msg_event_tick": 1})
