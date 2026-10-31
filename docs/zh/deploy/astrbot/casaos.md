# 在 CasaOS 部署

在 CasaOS 的自定义应用安装界面填写：

| 配置项 | 值 |
| --- | --- |
| 镜像 | `ghcr.io/sakura520222/astrbot:latest` |
| 容器端口 | `6185/tcp` |
| 主机端口 | `6185` |
| 容器数据目录 | `/AstrBot/data` |
| 主机数据目录 | 主机上的固定目录，例如 `/DATA/AppData/astrbot` |
| 环境变量 | `TZ=Asia/Shanghai` |
| 重启策略 | `unless-stopped` |

安装后访问 `http://CasaOS主机地址:6185`，创建管理账号并配置机器人。更新前备份主机数据目录，更新容器时继续挂载同一个目录。

需要额外端口或沙箱时，按对应平台文档配置。Compose 配置见 [Docker 部署](/deploy/astrbot/docker)。
