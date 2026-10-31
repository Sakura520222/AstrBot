# 在 1Panel 部署

在面板的容器或 Compose 管理页面创建项目，使用以下配置。将数据目录设置为主机上的固定路径。

~~~yaml
services:
  astrbot:
    image: ghcr.io/sakura520222/astrbot:latest
    container_name: astrbot
    restart: unless-stopped
    ports:
      - "6185:6185"
    environment:
      TZ: Asia/Shanghai
    volumes:
      - ./data:/AstrBot/data
~~~

启动项目后，访问 `http://服务器地址:6185` 完成账号和机器人配置。需要外部访问时，检查防火墙和安全组，并通过反向代理配置 HTTPS。

更新时先备份原数据目录，再拉取镜像并重新创建容器。保留 `/AstrBot/data` 的原挂载路径。

镜像和运行参数见 [Docker 部署](/deploy/astrbot/docker)。
