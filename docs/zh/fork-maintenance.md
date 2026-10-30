# 个人 Fork 部署与维护

本仓库由 Sakura520222 独立维护。暂保留 AstrBot 名称和标识，首版为 **v4.29.3**，基于上游 **4.29.3**；本项目不是上游官方发行。

## 项目入口

- 官网：<https://astrbot.pyabunny.com>
- 中文文档：<https://astrbot.pyabunny.com/docs>
- 代码、问题和版本：<https://github.com/Sakura520222/AstrBot>

原来的官方文档、发布和镜像地址仅代表上游项目。个人 Fork 的对应入口如上；历史部署文档中的商业托管、桌面客户端等第三方服务不保证提供此 Fork。

## 从源码安装

准备 Git、uv、Python 3.12+：

```bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
```

访问 `http://localhost:6185`。首次启动从本 Fork 的 GitHub Release 获取版本匹配的 WebUI。下载资源包含在每个 Release 的 `AstrBot-v<版本>-dashboard.zip` 中。

## 保留已有实例

迁移前备份整个 `data/`。这个目录包含框架配置、插件、插件配置、历史数据库和插件数据，不要用空目录覆盖。同步源码使用 `origin`（个人 Fork）；`upstream` 仅用于主动合并原项目变更。

```bash
git pull --ff-only origin master
uv sync --locked --inexact
uv run --no-sync main.py
```

有未提交代码时先备份或提交，再更新。运行中的实例应正常停止后再更新。`--inexact` 保留插件额外安装的依赖。

## 容器

仓库的 `compose.yml` 已使用个人 GHCR 镜像：

```bash
docker compose up -d
```

固定版本为 `ghcr.io/sakura520222/astrbot:4.29.3`，`latest` 跟随稳定版本。镜像挂载目录保持为 `./data:/AstrBot/data`。

## 版本规则

Fork 版本通过 `astrbot.__version__` 与 `pyproject.toml` 保持一致，并对齐上游正式版本，目前为 4.29.3。插件按正常版本规则检查，不增加独立版本或兼容层。

内置更新只使用此 Fork 的 GitHub Releases，不向官方更新源请求核心包或 WebUI。公共插件市场继续沿用 AstrBot 生态。

## 发布和站点

发布变更经验证合并后，从对应 `master` 提交推送 `v<版本>` 标签。GitHub Actions 自动发布核心/WebUI ZIP、Python 分发包、校验文件和 GHCR 镜像。Python 分发包仅作为 GitHub Release 资产，不自动推送到官方 PyPI 包。

官网位于 `site/`，中文文档位于 `docs/zh/`，通过 Cloudflare Pages Git 集成部署。发布与站点都不依赖上游的 R2、Docker Hub、服务器或 harbour 凭据。
