<div align="center">
  <img src="docs/public/logo.png" width="110" alt="AstrBot" />
  <h1>AstrBot</h1>
  <p>多平台 AI 助手，支持模型、插件、知识库与工具调用。</p>
  <p><a href="https://astrbot.pyabunny.com/">官网</a> · <a href="https://astrbot.pyabunny.com/docs/">文档</a> · <a href="https://github.com/Sakura520222/AstrBot/releases">下载</a> · <a href="https://github.com/Sakura520222/AstrBot/issues">问题反馈</a></p>
</div>

## 功能

- 连接 Telegram、QQ、飞书、企业微信、Discord、Slack 等消息平台。
- 配置模型服务，使用工具调用、Skills、MCP 和定时任务。
- 安装插件，导入文档建立知识库。
- 通过 WebUI 管理聊天、机器人、配置、插件和运行日志。

## 源码运行

需要 Git、[uv](https://docs.astral.sh/uv/) 和 Python 3.12+。

```bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
```

打开 <http://localhost:6185>，按界面提示完成账号设置。首次启动下载当前版本对应的 WebUI。

更新前正常停止实例，备份并保留整个 `data/` 目录，其中包含框架配置、插件、插件配置、数据库和插件数据。`--inexact` 保留插件额外安装的依赖。

## Docker

```bash
docker compose up -d
```

Compose 使用 `ghcr.io/sakura520222/astrbot:latest`，将 `./data` 挂载到 `/AstrBot/data`。固定版本可使用 `ghcr.io/sakura520222/astrbot:4.29.3`。镜像支持 Linux amd64 和 arm64。

详见[源码部署](https://astrbot.pyabunny.com/docs/deploy/astrbot/cli)和 [Docker 部署](https://astrbot.pyabunny.com/docs/deploy/astrbot/docker)。

## 开发

前端及文档使用 Node.js 24、pnpm 10.28.2。

```bash
# dashboard/
pnpm install --frozen-lockfile
pnpm dev
pnpm build

# docs/
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:build
```

WebUI 开发端口为 3000。运行自行构建的 WebUI：`uv run --no-sync main.py --webui-dir dashboard/dist`。开发和检查约定见 [AGENTS.md](AGENTS.md)。

## 更新与发布

版本号对齐上游基线，目前为 `4.29.3`。版本列表由站点的公开清单提供，下载包和镜像发布到本仓库的 GitHub Releases 与 GHCR。

发布变更合并到 `master` 后，推送对应的 `v*` 标签。GitHub Actions 构建核心与 WebUI ZIP、Python 分发包、SHA256 校验文件和容器镜像，并刷新站点版本清单。官网与文档由 GitHub Actions 自动部署。

## 来源与许可

由 [Sakura520222](https://github.com/Sakura520222) 维护，基于 [AstrBot](https://github.com/AstrBotDevs/AstrBot)，保留原作者、贡献者署名和历史记录。项目采用 [AGPL-3.0-or-later](LICENSE)。公共插件市场、模型服务和消息平台由各自维护者提供。
