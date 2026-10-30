# Maintaining this personal fork

This repository is independently maintained by Sakura520222. It keeps the AstrBot name and logo for now. The first fork release is **v4.29.3**, based on upstream **4.29.3**; it is not an official AstrBotDevs release.

- Website: <https://astrbot.pyabunny.com>
- Documentation: <https://astrbot.pyabunny.com/docs>
- Source, issues and releases: <https://github.com/Sakura520222/AstrBot>

## Install and preserve data

Use Git, uv and Python 3.12 or later:

```bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
```

Open `http://localhost:6185`. Back up and preserve the entire `data/` directory when updating: it contains configuration, plugins, plugin configuration, databases and plugin data. Stop the running instance before updating. `--inexact` preserves extra plugin dependencies.

The bundled compose file uses `ghcr.io/sakura520222/astrbot:latest`; the first stable image is `ghcr.io/sakura520222/astrbot:4.29.3`.

## Version and publishing

`astrbot.__version__` and project metadata keep the upstream-aligned version, currently 4.29.3. Plugin version requirements use the normal framework version without a separate fork compatibility layer. Core and WebUI updates still use this personal fork's releases.

Push a reviewed `v<version>` tag from the merged master commit to build release packages and the GHCR image. Website source is in `site/`; documentation is in `docs/`, with Cloudflare Pages Git deployments. Historical pages describing upstream hosted services or desktop clients do not imply that those services distribute this fork.

## Upstream tag namespace

The fork and upstream share version numbers, but their release commits and tags are independent. Fetch upstream branches with `git fetch --no-tags upstream`; archive upstream tags with `git fetch --no-tags upstream "refs/tags/*:refs/tags/upstream/*"`. The original upstream tag is preserved locally as `upstream/v4.29.3`. Never force-update a published fork tag to an upstream tag with the same name.
