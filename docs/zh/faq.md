# FAQ

## 管理面板相关

### 管理面板打开时遇到 404

先查看启动日志中的 WebUI 资源检查结果。需要手动安装时，从[版本发布页](https://github.com/Sakura520222/AstrBot/releases)下载与框架版本匹配的 `AstrBot-v<版本>-dashboard.zip`，正常停止实例，将包内 `dist/` 放入 `data/`，保留其他数据，再启动。也可以按[源码部署](/deploy/astrbot/cli#构建-webui)构建 WebUI。

### 首次登录

按照页面提示完成账号设置。如果页面要求先登录，默认用户名为 `astrbot`，随机初始密码在首次启动日志中显示。登录后设置自己的账号密码。启动日志中的初始密码只显示一次，已有账号继续使用原密码。

### 管理面板的密码忘记了

使用命令行交互重设密码，完成后重启实例。

源码部署，在项目目录执行：

```bash
uv run --no-sync astrbot password
```

Docker 部署：

```bash
docker exec -it astrbot astrbot password
docker restart astrbot
```

脚本安装的工具环境：

```bash
uv tool run astrbot password
```

需要同时修改用户名时，添加 `--username <新用户名>`。这些命令保留框架配置、插件和历史数据。

### 升级 AstrBot 后密码正确但无法登录

如果你确认管理面板密码正确，但升级 AstrBot 后仍然无法登录，可能是旧版 WebUI 静态文件缓存与新版后端不兼容。

解决方案：

1. 停止 AstrBot。
2. 删除 AstrBot 的 `data` 目录下的 `dist` 文件夹，即 `AstrBot/data/dist`。
3. 重新启动 AstrBot。
4. 访问管理面板后按 `Ctrl+Shift+R` 或 `Ctrl+F5`（macOS 用户请按 `Cmd+Shift+R`）强制刷新页面。

重启后，AstrBot 会重新加载或下载匹配当前版本的 WebUI 文件。

## AstrBot 使用相关

### 如何让 AstrBot 控制我的 Mac / Windows / Linux 电脑？

1. 在 AstrBot WebUI 的 `配置文件` 中选择机器人使用的配置文件，进入 `AI → 能力 → 使用电脑能力`，将 `运行环境` 设为 `local`。此处需要使用 AstrBot 内置 AI。
2. 在同一配置文件的 `访问控制 → 管理员 → 管理员 ID` 中添加你的用户 ID（可以通过 `/sid` 指令获取）。
3. 点击右下角的 `保存配置` 按钮。

> [!TIP]
> AstrBot 为了安全起见，运行环境选择 `local` 时，默认仅允许 AstrBot 管理员使用电脑能力。
> 运行环境可以选择 `sandbox`，此时所有用户都可以使用电脑能力（在一个隔离的沙箱中）。详情请看 [AstrBot 沙箱环境](/use/astrbot-agent-sandbox.md)

### 机器人在群聊无法聊天

1. 群聊情况下，由于防止消息泛滥，不会对每条监听到的消息都回复，请尝试 @ 机器人或者使用唤醒词来聊天，比如默认的 `/`，输入 `/你好`。

### 没有权限操作管理员指令

1. `/name, /provider, /dashboard_update, /op, /deop, /persona, /llm, /plugin, /model, /groupnew` 等是默认的管理员指令。可以通过 `/sid` 指令得到用户的 ID，然后在 `配置文件` 中选择机器人使用的配置文件，在 `访问控制 → 管理员 → 管理员 ID` 中添加该 ID，并点击右下角的 `保存配置`。

### 本地渲染 Markdown 图片（t2i）时中文乱码

可以自定义字体。详见 -> [#957](https://github.com/AstrBotDevs/AstrBot/issues/957#issuecomment-2749981802)

推荐 [Maple Mono](https://github.com/subframe7536/maple-font) 字体。

### API 返回的 completion 无法解析

这是由于供应商的 API 返回了空文本，尝试以下步骤：

1. 检查 API Key 是否仍然有效
2. 检查是否达到 API 调用限制或配额
3. 检查网络连接
4. 尝试 `reset`
5. 降低最大对话次数设置
6. 切换使用同一供应商的其他模型，或不同供应商的模型

## 插件相关

### 插件安装不上

1. 插件通过 GitHub 安装，在国内访问 GitHub 确实有时候连不上。可以在 `设置 → 网络 → 代理与依赖源 → HTTP 代理` 中配置代理并保存；也可以在同一页面设置 `GitHub 加速地址`，或直接下载插件压缩包后在插件页安装。

### 安装插件后报错 `No module named 'xxx'`

![image](/images/3a147e44f3eb7d04.png)

这个是因为插件依赖的库没有被正常安装。一般情况下，AstrBot 会在安装好插件后自动为插件安装依赖库，如果出现了以下情况可能造成安装失败：

1. 网络问题导致依赖库无法下载
2. 插件作者没有填写 `requirements.txt` 文件
3. Python 版本不兼容

解决方法：

结合报错信息，参考插件的 README 手动安装依赖库。你可以在 AstrBot WebUI 的 `数据与日志 → 日志 → 安装 pip 库` 中安装依赖库。

在弹窗中填写库名，按需填写 PyPI 软件仓库链接，然后点击 `安装`。

如果发现插件作者没有填写 `requirements.txt` 文件，请在插件仓库提交 Issue，提醒作者补充。


## OneBot v11 实现端 NapCat 连接相关

### 我明明按照文档的步骤做了，为什么 NapCat 连不上 Astrbot？

1. 如果你两个**全都**是使用 Docker 部署，请尝试在终端运行：

```bash
sudo docker network create newnet           # 创建新网络 
sudo docker network connect newnet astrbot  
sudo docker network connect newnet napcat   # 让两个容器连到一起
sudo docker restart astrbot
sudo docker restart napcat                  # 重启容器
```

运行无报错则回到 NapCat 的 WebUI，网络配置中，将你之前填写的 `ws://127.0.0.1:6199/ws` 修改为 `ws://astrbot:6199/ws`。

2. 如果只有 NapCat 是 Docker 部署，请将 NapCat 的 WebUI 网络配置中的 `ws://127.0.0.1:6199/ws` 修改为 `ws://宿主机IP:6199/ws`（宿主机 IP 请自行搜索如何查看）。
3. 如果都不是 Docker 部署，则请将 NapCat 的 WebUI 网络配置中的 `ws://127.0.0.1:6199/ws` 修改为 `ws://localhost:6199/ws` 或 `ws://127.0.0.1:6199/ws`。
