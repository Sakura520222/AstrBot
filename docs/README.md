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

## GitHub Pages

GitHub 仓库为 `Sakura520222/AstrBot`，生产分支为 `master`。仓库根目录构建命令为：

```bash
cd docs && pnpm install --frozen-lockfile && pnpm docs:build && cd .. && node scripts/build_site.mjs
```

输出目录为 `site-dist`。`.github/workflows/build-docs.yml` 使用 Node.js 24、pnpm 10.28.2 构建并上传 Pages 产物；只有 `master` 的站点变更或手动运行才会部署，PR 只构建验证。

导航入口、安装命令、域名和版本发生变化时，同步更新中英文维护指南与仓库 README。

## 域名与部署授权

仓库 Settings → Pages 的构建源选择 **GitHub Actions**，自定义域名为 `astrbot.pyabunny.com`。Cloudflare DNS 中该子域名的 CNAME 指向 `sakura520222.github.io` 并开启代理（橙云），SSL/TLS 模式保持 **Full (strict)**，开启 **Always Use HTTPS**。Cloudflare 提供站点入口证书，并严格验证 GitHub Pages 目标主机的源站证书。官网首页位于 `/`，文档位于 `/docs/`。

源站证书验证要求见 [Cloudflare Full (strict) 文档](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)。维护时不要降低 TLS 模式或关闭证书校验。

部署作业使用 GitHub 自带的 `GITHUB_TOKEN` 与 OIDC 临时授权，仅授予 `pages: write` 和 `id-token: write`，部署环境为 `github-pages`。无需额外 Actions Secrets 或长期 API 令牌。
