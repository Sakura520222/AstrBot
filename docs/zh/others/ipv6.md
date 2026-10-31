# IPv6 访问

AstrBot 可以绑定 IPv6 地址。停止实例后，在 `data/cmd_config.json` 的 `dashboard` 配置中设置：

~~~json
{
  "host": "::",
  "port": 6185
}
~~~

重启后，使用带方括号的地址访问，例如 `http://[2001:db8::1]:6185`，并将示例地址替换为主机实际的 IPv6 地址。

`::` 绑定 IPv6 接口；是否同时接受 IPv4 连接取决于操作系统和网络环境。也可以将 `host` 设为主机上的某个具体地址。

远程访问需要主机已有可路由的 IPv6 地址和对应的入站防火墙规则。保持 WebUI 账号认证，并通过 HTTPS 反向代理提供公网访问。绑定地址也可以通过 `ASTRBOT_DASHBOARD_HOST` 环境变量设置。
