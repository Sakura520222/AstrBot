<div align="center">
  <img src="docs/public/logo.png" width="110" alt="AstrBot" />
  <h1>AstrBot · 个人 Fork</h1>
  <p>由 Sakura520222 独立维护，保留 AstrBot 标识、核心能力与插件生态。</p>
  <p><a href="https://astrbot.pyabunny.com">项目官网</a> · <a href="https://astrbot.pyabunny.com/docs">中文文档</a> · <a href="https://github.com/Sakura520222/AstrBot/releases">下载版本</a> · <a href="https://github.com/Sakura520222/AstrBot/issues">问题反馈</a></p>
</div>

## 项目说明

这是基于 [AstrBotDevs/AstrBot](https://github.com/AstrBotDevs/AstrBot) 的个人维护分支，不是上游官方发行版。首个 Fork 版本为 **v4.29.3**，基于上游 **4.29.3**，版本号与所基于的上游正式版本对齐。

暂时保留 AstrBot 名称、图标、`astrbot` 导入路径和命令名。仓库、问题反馈、发布下载、内置更新、容器镜像及官网文档由此 Fork 维护，原项目署名、许可和历史记录继续保留。

## 功能

- 多平台：支持 Telegram、QQ、飞书、Discord、Slack 等消息平台。
- 模型与 Agent：支持工具调用、Skills、MCP、知识库及定时任务。
- 插件扩展：沿用 AstrBot 插件接口和公共插件市场，插件版本声明使用与上游一致的版本号检查。
- 可视化管理：提供聊天、配置、插件、日志和数据管理 WebUI。
- 个人维护：独立自动发版、GHCR 镜像及中文官网文档。

## 源码启动

需要 Git、[uv](https://docs.astral.sh/uv/) 和 Python 3.12+。

```bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
```

打开 <http://localhost:6185>，按界面完成管理账号设置。首次启动从本仓库对应版本的 Release 下载 WebUI。

已有实例请先备份并保留整个 `data/` 目录：框架配置、插件及其配置、数据库和插件数据均保存在这里。`--inexact` 会保留虚拟环境中插件额外安装的依赖。

## Docker 部署

```bash
docker compose up -d
```

`compose.yml` 使用 `ghcr.io/sakura520222/astrbot:latest`，挂载 `./data:/AstrBot/data`。固定版本可使用 `ghcr.io/sakura520222/astrbot:4.29.3`。

## 本地开发

Node.js 使用 24，pnpm 使用 10.28.2。

```bash
# 在 dashboard/ 内执行
pnpm install --frozen-lockfile
pnpm dev
pnpm build

# 在 docs/ 内执行
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:build
```

WebUI 开发服务默认使用 3000 端口。使用自行构建的前端时执行 `uv run --no-sync main.py --webui-dir dashboard/dist`。开发规则及检查命令见 [AGENTS.md](AGENTS.md)。

## 版本和发布

- `astrbot.__version__` 与 `pyproject.toml` 保存 Fork 版本，目前为 `4.29.3`。
- 版本号对齐上游基线，插件声明的 `astrbot_version` 按正常框架版本检查，无需额外兼容版本。
- 合并发布变更后，在 `master` 对应提交创建并推送 `v*` 标签。GitHub Actions 自动构建核心/WebUI ZIP、Python wheel/sdist、SHA256 校验和与 GHCR 镜像，并创建中文 Release。
- 内置更新只查询此 Fork 的 GitHub Releases，日常二改通过 Git 分支和 PR 维护。
- `master` 的站点相关变更通过 GitHub Actions 构建验证后，直接部署 `site/` 官网和 `docs/` 文档到 Cloudflare Pages。Actions Secrets 需要 `CLOUDFLARE_ACCOUNT_ID` 与仅授予 Pages 编辑权限的 `CLOUDFLARE_API_TOKEN`，不依赖上游私有凭据。

查看 [v4.29.3 更新说明](changelogs/v4.29.3.md) 和[中文维护文档](docs/zh/fork-maintenance.md)。

## 上游与许可

本项目派生自 [AstrBot](https://github.com/AstrBotDevs/AstrBot)，感谢原作者和所有贡献者。继续采用 **AGPL-3.0-or-later**，详见 [LICENSE](LICENSE)。公共插件市场和第三方模型、消息平台仍由各自维护者提供。历史文档中的上游专属服务不属于个人 Fork 的发行范围，下载和维护入口以本文及维护文档为准。
