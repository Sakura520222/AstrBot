# GitHub download proxies

If GitHub files or plugin archives cannot be downloaded, configure an HTTP proxy or GitHub proxy address under System Settings → Network → Proxy & Dependency Sources.

## URL prefixes

The GitHub proxy address supports services that forward requests using a URL prefix. For a proxy at `https://proxy.example`, a request may look like:

~~~text
https://proxy.example/https://github.com/Sakura520222/AstrBot/releases/download/v4.29.3/AstrBot-v4.29.3-core.zip
~~~

Enter the service's base address, save, and retry the download. Supported paths and request types depend on the proxy service.

## HTTP proxies

HTTP proxies and URL-prefix proxies are separate settings. Enter the proxy address in the corresponding field and save. You can also install a plugin by uploading its ZIP archive.

Version checks use the website's public release feed. GitHub download proxies primarily affect release packages and plugin files.
