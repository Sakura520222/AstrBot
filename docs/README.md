# AstrBot 个人 Fork 文档

本目录维护 Sakura520222/AstrBot 的中文文档，并保留上游英文使用资料。

- 官网：https://astrbot.pyabunny.com
- 文档：https://astrbot.pyabunny.com/docs/
- 中文内容：`zh/`；英文内容：`en/`。
- VitePress 使用 `/docs/` 基础路径。

## 开发与构建

使用 Node.js 24、pnpm 10.28.2：

```bash
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:build
```

构建完成后，在仓库根目录执行 `node scripts/build_site.mjs`。它将 `site/` 官网和文档产物合并到 `site-dist/`，其中首页为官网，`docs/` 为文档。

## Cloudflare Pages

个人项目名称为 `astrbot-pyabunny`，Git 来源为 `Sakura520222/AstrBot`，生产分支为 `master`。仓库根目录构建命令为：

```bash
cd docs && pnpm install --frozen-lockfile && pnpm docs:build && cd .. && node scripts/build_site.mjs
```

输出目录为 `site-dist`。构建环境使用 `NODE_VERSION=24`、`PNPM_VERSION=10.28.2` 和 `SKIP_DEPENDENCY_INSTALL=true`。域名为 `astrbot.pyabunny.com`，由 GitHub Actions 在主分支站点变更通过构建后直接部署，不依赖上游的服务器凭据。

导航入口、安装命令、域名和版本发生变化时，同步更新中英文维护指南与仓库 README。

## Actions 部署凭据

仓库需设置 `CLOUDFLARE_ACCOUNT_ID` 和 `CLOUDFLARE_API_TOKEN` 两个 Actions Secrets。API 令牌仅需目标账户的 **Cloudflare Pages → Edit** 权限，不需要 DNS、Workers 或账户管理权限。不要把令牌粘贴到聊天、代码或文档中。PR 不执行部署；`master` 的官网、文档或构建脚本变化在验证后部署相同产物。
