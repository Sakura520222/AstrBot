# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

AstrBot is a multi-platform LLM chatbot framework: an asyncio Python backend plus a Vue 3/Vuetify WebUI (`dashboard/`) and VitePress docs (`docs/` and `site/`). This is the Sakura520222 fork of AstrBotDevs/AstrBot; `origin` is this repo, `upstream` is sync-only.

**AGENTS.md holds the binding development conventions** (fork policy, language rules, versioning, release process, CI behavior) — read it before making changes. The constraints most likely to bite:

- README/maintenance/release notes in Chinese; code comments, log messages, PR titles and descriptions in English; Conventional Commits.
- KISS and minimal correct changes; extract a helper only when the same logic repeats 3+ times or inline code exceeds ~50 lines. New docstrings in Google format.
- Runtime paths come from `astrbot.core.utils.astrbot_path` (supports `ASTRBOT_ROOT` override) — never hardcode user directories. Stay cross-platform (Windows/macOS/Linux, Arm64/x86).
- `data/` is live user state (framework config, plugins, databases). Never wipe, overwrite, or commit it; tests use a separate `ASTRBOT_ROOT`.
- Version triple must match: `[project].version` in `pyproject.toml` == `astrbot.__version__`; `astrbot.core.config.default.VERSION` derives from it. Versions align with the upstream baseline (currently 4.29.3).
- `.github/copilot-instructions.md` is partly stale (npm/Node 20/Python 3.10 era) — prefer AGENTS.md and README.md when they conflict.

The repo has a CodeGraph index (`.codegraph/`): query `codegraph_explore` before grep/read loops when locating or understanding code.

## Commands

### Backend (Python 3.12+, uv)

```bash
uv sync --locked --inexact        # install deps (--inexact preserves plugin-installed extras)
uv run --no-sync main.py          # run backend; WebUI at http://localhost:6185
uv run --no-sync main.py --webui-dir dashboard/dist   # run against a locally built WebUI

uv run --no-sync ruff format .    # format (run before committing; pre-commit enforces it)
uv run --no-sync ruff check .     # lint

uv run --no-sync pytest tests/test_smoke.py                 # one file
uv run --no-sync pytest "tests/test_main.py::test_case"     # one test
```

First run creates `data/plugins`, `data/config`, `data/temp` (tests expect them too; CI's `scripts/run_pytests_ci.sh` mkdirs them and sets `TESTING=true`).

### Dashboard (`dashboard/` — Node 24, pnpm 10.28.2)

```bash
pnpm install --frozen-lockfile
pnpm dev          # Vite dev server on port 3000
pnpm build        # mdi font subsetting + vue-tsc typecheck + vite build
pnpm typecheck
pnpm lint         # eslint --fix
pnpm i18n:check
node --test tests/*.test.mjs     # dashboard unit tests
```

### Docs (`docs/` — VitePress)

```bash
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:build
```

### API contract

Backend REST routes live in `astrbot/dashboard/api/`; the OpenAPI contract is `openspec/openapi-v1.yaml`. After changing routes, request/response models, or the contract, run `cd dashboard && pnpm generate:api` and commit the regenerated client in `dashboard/src/api/generated/`.

## Architecture

### Startup

`main.py` → `runtime_bootstrap` → resolve/repair the WebUI dist (`AstrBotUpdater.ensure_dashboard`) → `InitialLoader` (`astrbot/core/initial_loader.py`) → `AstrBotCoreLifecycle` (`astrbot/core/core_lifecycle.py`). `initialize()` wires the DB, config/profile manager, provider/platform/plugin managers, event bus, and one `PipelineScheduler` per config profile; `start()` fires `OnAstrBotLoadedEvent` hooks and awaits all tasks. The installed `astrbot` CLI lives in `astrbot/cli/`.

### Message flow (the core path)

1. **Platform adapters** (`astrbot/core/platform/sources/*`) subclass `PlatformAdapter`, convert native platform messages into `AstrBotMessage` + a platform-specific `AstrMessageEvent` subclass (implementing `send()`, streaming, group info) and enqueue them.
2. **`EventBus.dispatch`** (`astrbot/core/event_bus.py`) selects the config profile by `unified_msg_origin` (UMO, `platform_name:message_type:session_id`) — this key is used throughout for session-scoped state (provider isolation, personas, whitelists, plugin session state) — and dispatches to that profile's scheduler, applying session isolation first.
3. **`PipelineScheduler`** (`astrbot/core/pipeline/scheduler.py`) runs stages in the order defined by `astrbot/core/pipeline/stage_order.py`: WakingCheck → WhitelistCheck → SessionStatusCheck → RateLimit → ContentSafetyCheck → PreProcess → Process → ResultDecorate → Respond. Stages are onion-style: a stage written as an async generator `yield`s between its pre- and post-processing, and `_process_stages` recurses into all later stages at each yield. `event.stop_event()` halts propagation; `event.set_result()` queues the reply that RespondStage sends.
4. **`PreProcessStage`** evaluates handler filters and records activated handlers on the event; **`ProcessStage`** runs them via `StarRequestSubStage` and/or invokes the LLM agent chain via `AgentRequestSubStage` → `astrbot/core/astr_main_agent.py`. A plugin handler can also return a `ProviderRequest` to trigger the agent chain itself.

### Star (plugin) system

"Star" = plugin (v4 naming; see `astrbot/core/star/README.md`).

- Plugins subclass `Star` (`astrbot/core/star/star.py`); the subclass registers itself into `star_map` via `__init_subclass__`.
- Handlers are methods registered by decorators from `astrbot/core/star/register/` (`@filter.command`, `@filter.command_group`, `@filter.event_message_type`, `@filter.platform_adapter_type`, `@filter.regex`, event hooks via `EventType`). Each registration lands in the global `star_handlers_registry` as a `StarHandlerMetadata` carrying `event_filters`.
- Filters (`astrbot/core/star/filter/`) decide activation: `CommandFilter` parses/validates typed command params from the message, `CommandGroupFilter` nests subcommands (incomplete group commands print their own subtree), and `CustomFilter`s (permission, platform, message type) compose with `&`/`|`.
- `PluginManager` (`astrbot/core/star/star_manager.py`) loads plugins from `astrbot/builtin_stars/` (reserved, not uninstallable) and `data/plugins/` (user-installed), honoring `metadata.yaml`, `_conf_schema.json` (config schema → `AstrBotConfig`), and `requirements.txt` (auto-installed with dependency recovery).
- Plugins act through `Context` (`astrbot/core/star/context.py`): provider lookup/selection, config access, message sending, LLM tools. `astrbot/api/` is the public import surface plugins code against — keep it stable.

### Other core subsystems

- **Providers** (`astrbot/core/provider/`): LLM/TTS/STT/embedding sources (OpenAI, Anthropic, Gemini, …) registered via `register.py`, typed by `ProviderType`, managed by `ProviderManager`. `func_tool_manager.py` registers LLM function tools; `astrbot/core/tools/` covers MCP integration.
- **Config** (`astrbot/core/config/`): `default.py` defines the schema-backed default config (VERSION derives from `astrbot.__version__`); `AstrBotConfigManager` supports multiple profiles, each with its own pipeline scheduler.
- **Dashboard** (`astrbot/dashboard/`): FastAPI app served by Hypercorn (`server.py`, `api/app.py`); per-resource route modules in `api/*.py` aggregated by `api/router.py`, business logic in `services/`. Serves the built WebUI dist, SSE log streaming (`LogBroker`), and plugin custom pages.
- **Persistence** (`astrbot/core/db/`): sqlmodel + aiosqlite (conversations, cron jobs, plugin shared state via `sp`).
- **Knowledge base** (`astrbot/core/knowledge_base/`): faiss + BM25 retrieval over imported documents.
- **Agent layer**: `astrbot/core/agent/` (agent runners), `astrbot/core/astr_main_agent.py` (main chat agent assembly: personas, contexts, tools, KB), `astrbot/core/skills/`, `astrbot/core/subagent_orchestrator.py`.
- **Cron** (`astrbot/core/cron/`): APScheduler-backed `CronJobManager`, jobs persisted in the DB.
- **Update** (`astrbot/core/updater.py`, `zip_updater.py`): self-update from this repo's GitHub Releases; version manifest at `https://astrbot.pyabunny.com/releases.json`.
