# AstrBot 文档

- 官网：https://astrbot.pyabunny.com/
- 文档：https://astrbot.pyabunny.com/docs/
- 中文内容：`zh/`；英文内容：`en/`。

## 构建

使用 Node.js 24、pnpm 10.28.2：

```bash
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:build
```

构建启用死链检查。新增或移动页面时，同步修改导航、正文链接及图片路径。

首页来自 `index.md` 与 VitePress 主题中的 Vue 组件。一次构建生成根路径首页、`/docs/` 中文文档与 `/docs/en/` 英文文档，三者共用导航和主题。

在仓库根目录执行 `node scripts/build_site.mjs`，将完整站点暂存到 `site-dist/`，供站内链接检查和 GitHub Pages 发布。暂存步骤保留旧文档资源地址，并写入空版本清单用于本地检查。生产工作流在上传产物前填入真实发行信息。

## 部署

`.github/workflows/build-docs.yml` 构建并部署 `master` 到 GitHub Pages。PR 只验证构建。部署作业使用 `GITHUB_TOKEN` 与 OIDC 临时授权，仅需要 `pages: write`、`id-token: write`。

仓库 Pages 构建源为 GitHub Actions，自定义域名为 `astrbot.pyabunny.com`。Cloudflare CNAME 指向 `sakura520222.github.io` 并开启代理，保持 **Full (strict)** 和 **Always Use HTTPS**。不要降低源站证书验证等级。

## 版本清单

站点工作流通过 GitHub API 读取本仓库已公开的 Releases，只导出版本标签、发布时间、更新说明及源码包地址到 `/releases.json`。访问 WebUI 检查更新时读取此静态清单，不需要用户的 GitHub 令牌。

发布工作流通过 `workflow_dispatch` 刷新站点清单。这里只使用 Actions 临时令牌，不添加长期部署密钥，不改写已公开版本的下载资产。
