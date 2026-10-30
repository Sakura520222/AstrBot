# 从源码部署个人 Fork

完整说明见[个人 Fork 部署与维护](/fork-maintenance)。准备 Git、uv 和 Python 3.12+，执行：

```bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
```

打开 `http://localhost:6185`。首次启动从本 Fork 的 GitHub Release 获取匹配的 WebUI。已有实例更新前，请停止运行并备份整个 `data/`，保留框架配置、插件及其配置、数据库和插件数据。

原上游源码地址与官方 PyPI 安装命令不用于此个人 Fork；历史部署文档以维护指南为准。
