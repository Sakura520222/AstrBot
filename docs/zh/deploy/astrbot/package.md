# 脚本安装

需要先安装 Git。安装脚本使用 uv 创建 Python 3.12 环境，并从本仓库安装 AstrBot。

## Linux 与 macOS

下载并查看脚本，然后执行：

~~~bash
curl -fsSL https://astrbot.pyabunny.com/docs/install.sh -o install.sh
bash install.sh
~~~

按终端提示选择依赖下载源。启动后查看日志中的 WebUI 地址及初始登录信息。

## Windows PowerShell

~~~powershell
Invoke-WebRequest https://astrbot.pyabunny.com/docs/install.ps1 -OutFile install.ps1
.\install.ps1
~~~

按照终端提示完成安装。也可以按[源码部署](/deploy/astrbot/cli)手动创建环境和运行。

## 初始化与启动

安装完成后，在运行目录执行：

```bash
astrbot init
astrbot run
```

`astrbot init` 创建实例的数据目录，`astrbot run` 启动服务。按页面或日志中的提示完成账号设置。

## 数据与更新

保留启动目录下的 `data/`，更新前正常停止实例并备份数据。脚本安装的是仓库源码，使用 uv 工具环境；使用说明见 [uv 工具文档](https://docs.astral.sh/uv/guides/tools/)。

需要修改项目源码或 WebUI 时，使用[源码部署](/deploy/astrbot/cli)。
