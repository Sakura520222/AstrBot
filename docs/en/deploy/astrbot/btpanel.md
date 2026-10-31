# Deploy with aaPanel

Create a project in the panel's container or Compose manager using the configuration below. Use a persistent host path for the data directory.

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

Start the project and open `http://SERVER:6185` to create an administrator account and configure the bot. Configure the firewall, security group, and an HTTPS reverse proxy for remote access.

Before updating, back up the existing data directory. Pull the new image and recreate the container while keeping the original `/AstrBot/data` mount.

See [Docker deployment](/en/deploy/astrbot/docker) for image and runtime options.
