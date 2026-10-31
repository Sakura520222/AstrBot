# Script installation

Install Git first. The installer uses uv with Python 3.12 and installs AstrBot from this repository.

## Linux and macOS

Download and review the script, then run it:

~~~bash
curl -fsSL https://astrbot.pyabunny.com/docs/install.sh -o install.sh
bash install.sh
~~~

Follow the terminal prompts to select download sources. Check startup logs for the WebUI URL and initial login information.

## Windows PowerShell

~~~powershell
Invoke-WebRequest https://astrbot.pyabunny.com/docs/install.ps1 -OutFile install.ps1
.\install.ps1
~~~

Follow the installation prompts. You can also create an environment manually using [source deployment](/en/deploy/astrbot/cli).

## Initialize and start

After installation, run these commands in the instance directory:

```bash
astrbot init
astrbot run
```

`astrbot init` creates the instance data directories and `astrbot run` starts the service. Follow the page or startup log prompts to complete account setup.

## Data and updates

Keep the startup directory's `data/` folder. Stop the instance normally and back it up before updating. The script installs repository source in a uv tool environment; see the [uv tools guide](https://docs.astral.sh/uv/guides/tools/).

Use [source deployment](/en/deploy/astrbot/cli) when modifying application code or the WebUI.
