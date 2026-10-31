# Deploy from source

Install Git, [uv](https://docs.astral.sh/uv/), and Python 3.12 or later.

## Install and start

~~~bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
~~~

Open `http://localhost:6185` and create an administrator account. The first startup downloads the WebUI matching the current version.

Continue with [platform setup](/en/platform/start) and [model setup](/en/providers/start).

## Update

Stop AstrBot normally and back up the entire `data/` directory, then run:

~~~bash
git pull --ff-only origin master
uv sync --locked --inexact
uv run --no-sync main.py
~~~

Keep `data/`: it contains framework configuration, plugins, plugin configuration, databases, and plugin data. `--inexact` preserves Python packages installed by plugins. Commit or back up uncommitted source changes before pulling.

You can also check and install releases in the WebUI system settings. Back up runtime data before updating.

## Build the WebUI

Use Node.js 24 and pnpm 10.28.2. From the repository root:

~~~bash
cd dashboard
pnpm install --frozen-lockfile
pnpm build
cd ..
uv run --no-sync main.py --webui-dir dashboard/dist
~~~

Use `pnpm dev` for the frontend development server, which defaults to port 3000.

## Ports

The WebUI defaults to port 6185. For remote access, configure the host firewall, cloud security group, and HTTPS. Additional adapter ports are documented in the corresponding platform guides.
