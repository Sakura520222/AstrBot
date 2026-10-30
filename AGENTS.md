# AstrBot 个人 Fork 开发约定

## 项目归属

仓库为 `https://github.com/Sakura520222/AstrBot`。`origin` 指向个人 Fork，`upstream` 仅供显式同步，不得将二改推送到上游。暂时保留 AstrBot 名称、标识、包名和命令，保留上游版权、许可证及历史记录。

README、维护说明和 Release 说明优先使用中文；代码注释、日志、PR 标题和描述使用英文。提交和 PR 标题遵循 Conventional Commits。不得新增 `*_SUMMARY.md` 等任务报告，不提交密钥、运行数据、日志、数据库或 `.codegraph/`。

<!-- CODEGRAPH_START -->
## CodeGraph

根目录存在 `.codegraph/` 时，理解或定位代码必须先使用 `codegraph_explore` 或 `codegraph explore` 查询相关符号及调用关系，再作必要补充搜索。没有索引的独立工作树使用常规工具；不得自动建立索引。
<!-- CODEGRAPH_END -->

## 上游标签命名空间

个人 Fork 的 `v*` 标签只指向本仓库已合并的发布提交。拉取上游分支使用 `git fetch --no-tags upstream`，避免自动导入同名官方标签；需要保留上游标签时使用 `git fetch --no-tags upstream "refs/tags/*:refs/tags/upstream/*"`。本工作区原官方 `v4.29.3` 已保存在 `upstream/v4.29.3`，不得强推覆盖已公开的 Fork 标签。

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

`pyproject.toml` 的 `[project].version` 与 `astrbot.__version__` 必须一致；`astrbot.core.config.default.VERSION` 从后者派生。个人 Fork 的版本号与所基于的上游正式版本对齐，首版为 4.29.3。

插件声明的 `astrbot_version` 直接使用与上游对齐的框架版本检查，不引入独立 Fork 版本或额外兼容版本。更新上游基线需验证现有插件和数据兼容性。

核心/WebUI 更新和下载必须使用此 Fork。公共插件市场及真正的第三方服务保留原始来源；不恢复上游专属更新源、统计脚本、部署凭据或发布令牌。

## 检查

```bash
uv run --no-sync ruff format .
uv run --no-sync ruff check .
uv run --no-sync pytest <受影响的测试>
```

前端变更执行类型检查、相关 `dashboard/tests/*.test.mjs` 和构建；文档变更执行 `pnpm docs:build`。测试通过后不无理由重复或扩大范围。发布还需验证版本一致性、更新源、插件兼容和资产内容，不得把运行数据或密钥打入包内。

## 工作流与发布

日常开发使用短期 `feature/*` 分支和 PR。首次 Fork 迁移包含发布链路和站点归属调整；后续使用 `release/<版本>` 分支，仅做版本、变更说明、发布阻断修复和验证。

后续发布可使用 `uv run --no-sync python scripts/prepare_release.py <版本>`。审核中文变更说明和 `uv.lock` 后合并到 `master`，再创建 `v<版本>` 标签，确保指向已合并提交。

`release.yml` 发布 GitHub Release、核心/WebUI ZIP、Python 分发包、SHA256 校验文件及 GHCR 镜像，仅使用本仓库的 `GITHUB_TOKEN`，不向上游 PyPI、Docker Hub、R2 或 release-harbour 发布。

官网源位于 `site/`，中文文档位于 `docs/zh/`，通过本账号 Cloudflare Pages Git 集成自动部署。修改域名时同步 README、包元数据、WebUI 链接和站点配置。CI 不假定上游 Secrets 存在，不调用付费模型接口或向用户、群聊发送验证消息。

PR 使用英文，说明问题、最终行为和相关验证，不写对话过程。发布完成并验证后清理短期发布分支。
