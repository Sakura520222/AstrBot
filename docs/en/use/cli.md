# PyaBot CLI {#cli-commands}

The PyaBot CLI initializes instances, starts PyaBot, updates common config values, and manages plugins.

If you install PyaBot with `uv`:

```bash
uv tool install git+https://github.com/Sakura520222/PyaBot.git --python 3.12
```

`uv` creates the `astrbot` executable and puts it on `PATH`. You can inspect the path with:

::: code-group

```bash [Linux / macOS]
which astrbot
```

```powershell [Windows]
where.exe astrbot
```

:::

> [!TIP]
> Run the commands below from the PyaBot working directory.

## Quick Start

Initialize the directory once, then start PyaBot:

```bash
pyabot init
pyabot run
```

`pyabot init` creates the data directories and configuration files required by PyaBot. After initialization, use `pyabot run` for later starts.

## Top-Level Commands

| Command | Purpose |
| --- | --- |
| `pyabot init` | Initialize the current directory as a PyaBot working directory. |
| `pyabot run` | Start PyaBot in the foreground. |
| `pyabot conf` | Read or update common config values. |
| `pyabot password` | Change the WebUI login password interactively. |
| `pyabot plug` | Create, install, update, remove, or search plugins. |
| `pyabot help` | Show CLI help. |
| `pyabot --version` | Show the PyaBot CLI version. |

## Start PyaBot

```bash
pyabot run
```

Common options:

| Option | Purpose |
| --- | --- |
| `-p, --port <PORT>` | Set the WebUI port. |
| `-r, --reload` | Enable plugin auto-reload for plugin development. |
| `--reset-password` | Reset the WebUI initial password on startup and print the new password in startup logs. |

Examples:

```bash
pyabot run --port 6185
pyabot run --reload
pyabot run --reset-password
```

If you forget the WebUI login password, run this from the PyaBot working directory:

```bash
pyabot run --reset-password
```

PyaBot regenerates the initial password during startup and prints it in startup logs. After logging in, change the password in the WebUI immediately.

When starting directly from source, you can also run:

```bash
python main.py --reset-password
```

## Config

`pyabot conf` reads and updates common config values.

```bash
pyabot conf get
pyabot conf get dashboard.port
pyabot conf set dashboard.port 6185
```

Supported keys:

| Key | Description |
| --- | --- |
| `timezone` | Time zone, for example `Asia/Shanghai`. |
| `log_level` | Log level: `DEBUG`, `INFO`, `WARNING`, `ERROR`, or `CRITICAL`. |
| `dashboard.port` | WebUI port. |
| `dashboard.username` | WebUI username. |
| `dashboard.password` | WebUI password. |
| `callback_api_base` | Callback API base URL. Must start with `http://` or `https://`. |

Changing the dashboard password writes the current password hashes automatically:

```bash
pyabot conf set dashboard.password "new-password"
```

You can also use the dedicated interactive password command:

```bash
pyabot password
pyabot password --username admin
```

## Plugins

`pyabot plug` manages plugins under `data/plugins`.

| Command | Purpose |
| --- | --- |
| `pyabot plug list` | List installed plugins. |
| `pyabot plug list --all` | Also show uninstalled plugins. |
| `pyabot plug search <QUERY>` | Search plugins. |
| `pyabot plug install <NAME>` | Install a plugin. |
| `pyabot plug update [NAME]` | Update one plugin, or all updatable plugins if no name is given. |
| `pyabot plug remove <NAME>` | Remove an installed plugin. |
| `pyabot plug new <NAME>` | Create a new plugin from the template. |

Use a GitHub proxy when installing or updating plugins:

```bash
pyabot plug install example-plugin --proxy https://gh-proxy.example.com/
pyabot plug update --proxy https://gh-proxy.example.com/
```

Creating a new plugin asks for the author, description, version, and repository URL:

```bash
pyabot plug new my-plugin
```

## Help

Show general CLI help:

```bash
pyabot help
```

Show help for a specific command:

```bash
pyabot help run
pyabot run --help
pyabot help conf
pyabot plug --help
```

Show the version:

```bash
pyabot --version
```
