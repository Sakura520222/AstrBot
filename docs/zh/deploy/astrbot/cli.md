# 源码部署

需要 Git、[uv](https://docs.astral.sh/uv/) 和 Python 3.12 或更新版本。

## 安装与启动

~~~bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
~~~

打开 `http://localhost:6185`，按照界面提示创建管理账号。首次启动会下载与当前版本匹配的 WebUI。

然后按[消息平台接入指南](/platform/start)添加机器人，按[模型配置指南](/providers/start)添加模型服务。

## 更新

先正常停止 AstrBot，备份整个 `data/` 目录，再执行：

~~~bash
git pull --ff-only origin master
uv sync --locked --inexact
uv run --no-sync main.py
~~~

`data/` 保存框架配置、插件、插件配置、数据库及插件数据。更新源码时保留此目录。`--inexact` 保留插件额外安装的 Python 依赖。

有未提交代码时，先提交或备份后再拉取。也可以在 WebUI 的系统设置中检查版本并更新；更新前仍需备份运行数据。

## 构建 WebUI

修改前端时需要 Node.js 24 和 pnpm 10.28.2。在仓库根目录执行：

~~~bash
cd dashboard
pnpm install --frozen-lockfile
pnpm build
cd ..
uv run --no-sync main.py --webui-dir dashboard/dist
~~~

前端开发服务使用 `pnpm dev`，默认端口为 3000。

## 端口

管理界面默认使用 6185。需要从其他设备访问时，检查主机防火墙和云服务器安全组，并为外部访问配置 HTTPS。平台适配器需要的额外端口见对应接入文档。
