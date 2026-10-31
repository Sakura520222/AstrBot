# FAQ

## Dashboard

### Dashboard returns 404

Check the startup logs for WebUI resource errors. To install the UI manually, download `AstrBot-v<VERSION>-dashboard.zip` matching the framework version from [Releases](https://github.com/Sakura520222/AstrBot/releases). Stop the instance, place the archive's `dist/` under `data/`, preserve other data, and restart. You can also [build the WebUI from source](/en/deploy/astrbot/cli#build-the-webui).

### First login

Follow the account setup prompt. If the page requires an initial login, the default username is `astrbot`; use the random initial password shown once in the startup log, then set your own account credentials. Existing accounts keep their current password.

### Forgot Dashboard Password

Reset the password interactively from the command line, then restart the instance.

Source deployment, from the project directory:

```bash
uv run --no-sync astrbot password
```

Docker:

```bash
docker exec -it astrbot astrbot password
docker restart astrbot
```

Script-installed tool environment:

```bash
uv tool run astrbot password
```

Add `--username <NEW-USERNAME>` to change the username too. These commands preserve configuration, plugins, and history.

### Correct Password Cannot Log In After Upgrading AstrBot

If you are sure the dashboard password is correct but still cannot log in after upgrading AstrBot, the old WebUI static files may be incompatible with the newer backend.

Solution:

1. Stop AstrBot.
2. Delete the `dist` folder under AstrBot's `data` directory: `AstrBot/data/dist`.
3. Restart AstrBot.
4. Access the dashboard in your browser. Press `Ctrl+Shift+R` or `Ctrl+F5` (or `Cmd+Shift+R` on macOS) to force refresh the page.

After restart, AstrBot will reload or download WebUI files that match the current version.

## Bot Core Related

### How to Let AstrBot Control My Mac / Windows / Linux Computer?

1. In the AstrBot WebUI, open `Config`, select the profile used by your bot, and go to `AI → Capabilities → Agent Computer Use`. Set `Computer Use Runtime` to `local`. This section requires the built-in AstrBot AI runner.
2. In the same profile, go to `Access Control → Administrators → Administrator IDs` and add your user ID (available through the `/sid` command).
3. Click `Save Configuration` in the bottom-right corner.

> [!TIP]
> For security reasons, when runtime environment is set to `local`, AstrBot only allows AstrBot administrators to use computer capabilities by default.
> You can select `sandbox` for the runtime environment, which allows all users to use computer capabilities (in an isolated sandbox). For more details, see [AstrBot Sandbox Environment](/en/use/astrbot-agent-sandbox.md)

### Bot Cannot Chat in Group Conversations

1. In group chats, to prevent message flooding, the bot will not respond to every monitored message. Please try mentioning (@) the bot or using a wake word to chat, such as the default `/`, for example: `/hello`.

### No Permission to Execute Admin Commands

1. `/name, /provider, /dashboard_update, /op, /deop, /persona, /llm, /plugin, /model, /groupnew` are the default admin commands. You can use the `/sid` command to get a user's ID, then open `Config`, select the profile used by your bot, add the ID under `Access Control → Administrators → Administrator IDs`, and click `Save Configuration` in the bottom-right corner.

### Chinese Characters Garbled When Locally Rendering Markdown Images (t2i)

You can customize the font. See details -> [#957](https://github.com/AstrBotDevs/AstrBot/issues/957#issuecomment-2749981802)

Recommended font: [Maple Mono](https://github.com/subframe7536/maple-font).

### Cannot Parse API Returned Completion & LLM Returns `<empty content>`

This is because the provider's API returned empty text. Try the following steps:

1. Check if the API key is still valid
2. Check if the API call limit or quota has been reached
3. Check network connection
4. Try reset
5. Lower the maximum conversation count setting
6. Switch to another model from the same provider / a different provider

## Plugin Related

### Cannot Install Plugin

1. Plugins are installed via GitHub. Access to GitHub from mainland China can indeed be unstable. Configure and save a proxy under `Settings → Network → Proxy & Dependency Sources → HTTP Proxy`. You can also set a `GitHub Proxy Address` on the same page, or download the plugin archive and install it from the Plugins page.

### Error `No module named 'xxx'` After Installing Plugin

![image](/images/3a147e44f3eb7d04.png)

This is because the plugin's dependencies were not installed properly. Normally, AstrBot automatically installs plugin dependencies after installing the plugin, but installation may fail in the following situations:

1. Network issues preventing dependency downloads
2. Plugin author did not include a `requirements.txt` file
3. Python version incompatibility

Solution:

Based on the error message, refer to the plugin's README to manually install dependencies. You can install dependencies in the AstrBot WebUI under `Data & Logs → Logs → Install pip Package`.

Enter the package name in the dialog, optionally specify a PyPI repository URL, and click `Install`.

If you find that the plugin author did not include a `requirements.txt` file, please submit an issue in the plugin repository to remind the author to add it.
