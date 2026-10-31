# Docker deployment

Install [Docker Engine](https://docs.docker.com/engine/install/) or [Docker Desktop](https://docs.docker.com/desktop/) with Docker Compose.

## Compose

~~~bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
docker compose up -d
~~~

Open `http://localhost:6185`, create an administrator account, and configure your bot. For remote access, replace `localhost` with the server address and configure the firewall and HTTPS.

`compose.yml` uses `ghcr.io/sakura520222/astrbot:latest` and mounts the local `data/` directory at `/AstrBot/data`. Pin the image tag to `4.29.3` when needed. Images support Linux amd64 and arm64.

## Run a container directly

Linux and macOS:

~~~bash
docker run -d --name astrbot --restart unless-stopped \
  -p 6185:6185 -e TZ=Asia/Shanghai \
  -v "$PWD/data:/AstrBot/data" \
  ghcr.io/sakura520222/astrbot:latest
~~~

Windows PowerShell:

~~~powershell
docker run -d --name astrbot --restart unless-stopped -p 6185:6185 -e TZ=Asia/Shanghai -v "${PWD}/data:/AstrBot/data" ghcr.io/sakura520222/astrbot:latest
~~~

Add adapter or sandbox ports as documented in their setup guides.

## Logs

~~~bash
docker logs -f astrbot
~~~

## Update

Back up the host `data/` directory, then run in the Compose project directory:

~~~bash
docker compose pull
docker compose up -d
~~~

Container updates replace the image. Keep the existing data mount to preserve configuration, plugins, and history.

## Sandboxes

Follow [Agent sandbox setup](/en/use/astrbot-agent-sandbox) for code execution. The repository's `compose-with-shipyard.yml` uses the same AstrBot image with a separately configured Shipyard service.
