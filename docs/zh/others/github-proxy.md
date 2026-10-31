# GitHub 下载代理

GitHub 文件或插件归档下载失败时，可以在 WebUI 的“系统设置 → 网络 → 代理与依赖源”中配置 HTTP 代理或 GitHub 加速地址。

## URL 前缀

GitHub 加速地址适用于按 URL 前缀转发请求的服务。例如代理地址为 `https://proxy.example`，文件请求会使用类似地址：

~~~text
https://proxy.example/https://github.com/Sakura520222/AstrBot/releases/download/v4.29.3/AstrBot-v4.29.3-core.zip
~~~

填写服务的基础地址，保存后重新尝试下载。具体支持的路径和请求类型以所用代理服务的文档为准。

## HTTP 代理

HTTP 代理用于应用的网络请求，与 URL 前缀代理是两种不同配置。填写符合界面要求的代理地址并保存。插件安装问题还可通过手动上传插件 ZIP 处理。

版本检查使用站点提供的公开版本清单。GitHub 下载代理主要影响发布包与插件文件的下载。
