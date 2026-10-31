# Docker 部署

安装 [Docker Engine](https://docs.docker.com/engine/install/) 或 [Docker Desktop](https://docs.docker.com/desktop/)，并准备 Docker Compose。

## Compose

~~~bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
docker compose up -d
~~~

访问 `http://localhost:6185`，创建管理账号并配置机器人。远程访问时，将 `localhost` 换成服务器地址，并配置防火墙和 HTTPS。

`compose.yml` 使用 `ghcr.io/sakura520222/astrbot:latest`，将当前目录的 `data/` 挂载到容器内的 `/AstrBot/data`。需要固定版本时，将镜像标签改为 `4.29.3`。镜像提供 Linux amd64 和 arm64 架构。

## 手动运行容器

Linux 和 macOS：

~~~bash
docker run -d --name astrbot --restart unless-stopped \
  -p 6185:6185 -e TZ=Asia/Shanghai \
  -v "$PWD/data:/AstrBot/data" \
  ghcr.io/sakura520222/astrbot:latest
~~~

Windows PowerShell：

~~~powershell
docker run -d --name astrbot --restart unless-stopped -p 6185:6185 -e TZ=Asia/Shanghai -v "${PWD}/data:/AstrBot/data" ghcr.io/sakura520222/astrbot:latest
~~~

消息平台或沙箱需要的额外端口按对应文档添加。

## 查看日志

~~~bash
docker logs -f astrbot
~~~

## 更新

先备份主机上的 `data/`，然后在 Compose 项目目录执行：

~~~bash
docker compose pull
docker compose up -d
~~~

容器更新通过替换镜像完成。保留原来的数据挂载目录，可以继续使用现有配置、插件和历史数据。

## 沙箱

需要代码执行沙箱时，按照 [Agent 沙箱](/use/astrbot-agent-sandbox)配置。仓库中的 `compose-with-shipyard.yml` 使用同一 AstrBot 镜像；Shipyard 是单独配置的沙箱服务。
