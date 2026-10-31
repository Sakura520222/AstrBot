# AstrBot 开发约定

## 项目归属

仓库为 `https://github.com/Sakura520222/AstrBot`。`origin` 指向本仓库，`upstream` 仅供显式同步，不得将本仓库改动推送到上游。保留 AstrBot 名称、标识、包名、命令、上游版权、许可证及历史记录。

README、维护说明和 Release 说明优先使用中文；代码注释、日志、PR 标题和描述使用英文。提交和 PR 标题遵循 Conventional Commits。不得新增 `*_SUMMARY.md` 等任务报告，不提交密钥、运行数据、日志、数据库或 `.codegraph/`。

<!-- CODEGRAPH_START -->
## CodeGraph

根目录存在 `.codegraph/` 时，理解或定位代码必须先使用 `codegraph_explore` 或 `codegraph explore` 查询相关符号及调用关系，再作必要补充搜索。没有索引的独立工作树使用常规工具；不得自动建立索引。
<!-- CODEGRAPH_END -->

## 上游标签命名空间

`v*` 标签只指向本仓库已合并的发布提交。拉取上游分支使用 `git fetch --no-tags upstream`，避免自动导入同名标签；归档上游标签时使用 `git fetch --no-tags upstream "refs/tags/*:refs/tags/upstream/*"`。不得强推覆盖已公开的标签或替换公开版本的下载资产。

## 环境与运行

Python 版本以 `pyproject.toml` 为准，当前为 3.12+；前端及文档使用 Node.js 24、pnpm 10.28.2。

```bash
uv sync --locked --inexact
uv run --no-sync main.py

# dashboard/ 内
pnpm install --frozen-lockfile
pnpm dev
pnpm build

# docs/ 内
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:build
```

后端默认端口 6185，WebUI 开发服务默认端口 3000。`data/` 保存框架配置、插件及配置、历史数据库和插件数据。更新、测试、发布不得清空或覆盖它；测试设置独立的 `ASTRBOT_ROOT`。使用 `uv sync --inexact` 保留插件额外依赖。

## 实现规则

- 遵循 KISS，从实际需求和最小正确改动出发，不增加无关功能、开关、依赖、抽象或兼容层。
- 优先内联。仅在相同逻辑重复至少三处，或内联超过约 50 行并明显破坏流程可读性时提取辅助函数；不随意重构现有函数结构。
- 非显然行为、函数和参数需要英文说明。所有新增 docstring 使用 Google 格式，包含适用的 `Args:`、`Returns:`、`Raises:`。
- 路径使用 `pathlib.Path`；运行路径通过 `astrbot.core.utils.astrbot_path` 获取，不硬编码用户目录。
- 保持 Windows、macOS、Linux 及 Arm64/x86 兼容。
- WebUI 保持组件化，避免重复代码。对话框标题以 `text-h3 pa-4 pb-0 pl-6` 为基础，按钮使用 `text` 或 `tonal`。
- 后端路由、请求/响应模型、OpenAPI 契约改变后，运行 `cd dashboard && pnpm generate:api` 并提交客户端更新。
- WebUI 导航、页面或术语改变时，同一 PR 更新 `docs/zh`、`docs/en` 的相关说明和截图；入口移动或重命名提供旧到新映射。尽量将布局调整与功能增加分开。

## 版本与兼容

`pyproject.toml` 的 `[project].version` 与 `astrbot.__version__` 必须一致；`astrbot.core.config.default.VERSION` 从后者派生。版本号与上游基线对齐，当前为 4.29.3。WebUI 构建从 `astrbot.__version__` 写入版本标记。

插件声明的 `astrbot_version` 直接使用框架版本检查，不增加额外兼容版本。更新上游基线需验证现有插件和数据兼容性。

核心/WebUI 更新和下载使用本仓库。版本查询使用 `https://astrbot.pyabunny.com/releases.json`，由站点工作流从本仓库公开 Releases 生成。公共插件市场及第三方服务保留真实来源；历史 Issue、PR 等出处保留原始地址。前端处理更新错误时必须检查响应状态和数据，不能把 `data: null` 当成功响应。

## 检查

```bash
uv run --no-sync ruff format .
uv run --no-sync ruff check .
uv run --no-sync pytest <受影响的测试>
```

前端变更执行类型检查、相关 `dashboard/tests/*.test.mjs` 和构建；文档变更执行 `pnpm docs:build`。测试通过后不无理由重复或扩大范围。发布还需验证版本一致性、更新源、插件兼容和资产内容，不得把运行数据或密钥打入包内。

CI 按组件路径触发。文档和官网改动只运行相关构建与链接检查，不启动后端全平台矩阵；后端、依赖和运行时改动继续运行完整测试。Issue 过期维护只允许手动执行。Fork 因用量被 GitHub 暂停时，需要仓库维护者在 Actions 页面恢复，普通权限开关不能替代该操作。

## 工作流与发布

日常开发使用短期 `feature/*` 分支和 PR。发布使用 `release/<版本>` 分支，仅做版本、变更说明、发布阻断修复和验证。

后续发布可使用 `uv run --no-sync python scripts/prepare_release.py <版本>`。审核中文变更说明和 `uv.lock` 后合并到 `master`，再创建 `v<版本>` 标签，确保指向已合并提交。

`release.yml` 发布 GitHub Release、核心/WebUI ZIP、Python 分发包、SHA256 校验文件及 GHCR 镜像，仅使用本仓库的 `GITHUB_TOKEN`，不向上游 PyPI、Docker Hub、R2 或 release-harbour 发布。

官网源位于 `site/`，中文文档位于 `docs/zh/`，由 GitHub Actions 构建验证后自动部署到本仓库 GitHub Pages。修改域名时同步 README、包元数据、WebUI 链接和站点配置。CI 不假定上游 Secrets 存在，不调用付费模型接口或向用户、群聊发送验证消息。

官网和文档直接介绍功能与操作，不写“个人 Fork”“首个版本”等迁移过程文案。文档必须通过站内死链检查，图片优先使用站内资源。删除页面时同步清理导航、正文链接和搜索入口。

PR 使用英文，说明问题、最终行为和相关验证，不写对话过程。发布完成并验证后清理短期发布分支。

站点部署使用 `GITHUB_TOKEN` 与 OIDC 临时授权，部署作业仅授予 `pages: write` 和 `id-token: write`，无需长期部署密钥。仅可信的 `master` 推送或手动运行执行部署；PR 只构建验证。仓库 Pages 构建源为 GitHub Actions，自定义域名为 `astrbot.pyabunny.com`，Cloudflare DNS 的 CNAME 指向 `sakura520222.github.io` 并开启代理，保持 `Full (strict)` 和强制 HTTPS。
