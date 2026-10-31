# Deploy with CasaOS

Use CasaOS custom application installation with these settings:

| Setting | Value |
| --- | --- |
| Image | `ghcr.io/sakura520222/astrbot:latest` |
| Container port | `6185/tcp` |
| Host port | `6185` |
| Container data path | `/AstrBot/data` |
| Host data path | A persistent directory, such as `/DATA/AppData/astrbot` |
| Environment | `TZ=Asia/Shanghai` |
| Restart policy | `unless-stopped` |

Open `http://CASAOS-HOST:6185`, create an administrator account, and configure the bot. Back up the host data directory before updating and keep the same mount when replacing the container.

Add adapter or sandbox ports as required by their guides. See [Docker deployment](/en/deploy/astrbot/docker) for Compose configuration.
