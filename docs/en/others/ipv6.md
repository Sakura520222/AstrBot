# IPv6 access

AstrBot can bind to an IPv6 address. Stop the instance and set these fields in the `dashboard` section of `data/cmd_config.json`:

~~~json
{
  "host": "::",
  "port": 6185
}
~~~

Restart and use a bracketed address such as `http://[2001:db8::1]:6185`, replacing the example with the host's actual IPv6 address.

`::` binds IPv6 interfaces. IPv4 availability on the same socket depends on the operating system and network configuration. You can also bind a specific address assigned to the host.

Remote access requires a routable IPv6 address and an appropriate inbound firewall rule. Keep WebUI authentication enabled and use an HTTPS reverse proxy for public access. The bind address can also be set with `ASTRBOT_DASHBOARD_HOST`.
