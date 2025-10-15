---
layout: blog_article
title: Self Hosting Journey
author: Andrea Canale
description: A little story about my experience with self-hosting and some advices.
thumbnail: /nextcloud-gmbh-logo-vector.svg
---

<script>
  import ExternalLink from '$lib/Components/ExternalLink.svelte';
</script>

## Why?

I started with self-hosting about 5 years ago when I set up a personal cloud with my Raspberry PI 4, that includes Jellyfin and a simple file manager to share files between my devices.

About 2 years ago I started to becoming aware of privacy problems of the various services I was using, so I started to look for alternatives and I found out that self-hosting could be a good solution for me.

Self-hosting requires a lot of free time, especially during the first setup, but it gives you a lot of freedom and control over your data. After the first setup, the things usually goes more smoothly, but you have to be ready to face some problems and to spend some time to fix them(especially if you host your machine at home).

This article requires knowledge about Linux administration, Docker and networking. If you are not familiar with these topics, I suggest you to make some pratice with simpler setup before trying to set up a complex server like the one in the article.

## My setup

When I started with self-hosting, I thought that having hardware in my homelab could be a good idea but with the time I have several issues with hardware problems so I decided to move to a VPS.

Actual setup:

- VPS from <ExternalLink href="https://contabo.com/">Contabo</ExternalLink> with 3vCPUs core(6 threads), 8GB RAM, 400GB SSD and 300 Mbit/s connection with 32TB out and unlimited in. I use Debian 13 as OS but you can choose also Red Hat derivates or upload your ISO.
- Raspberry PI 4B with 2 1TB SSD BTRFS RAID 1 for VPS backup + my laptop backup

I think that VPS is a good solution to avoid hardware problems and stability issues. The price is acceptable in my opinion, about 100 euro/year. Using a VPS require a bit more work to secure it properly, but it's not a big deal.

## Services

I actually host the following services:

- <ExternalLink href="https://nextcloud.com/">Nextcloud</ExternalLink> for file sharing, calendar, contacts and notes. It replaces entirely the Google Workspace except for Gmail(I use Proton Mail for that).
- <ExternalLink href="https://jellyfin.org/">Jellyfin</ExternalLink> for media streaming. It replaces Spotify and Netflix(if you have some film/series to upload).
- <ExternalLink href="https://github.com/dani-garcia/vaultwarden">VaultWarden</ExternalLink> for password management across every device. It's easier to set up than Bitwarden, and it requires less resources.
- <ExternalLink href="https://adguard.com/en/adguard-home/overview.html">AdGuard Home</ExternalLink> for network-wide ad blocking and tracking protection.
- <ExternalLink href="https://nlnetlabs.nl/projects/unbound/about/">Unbound DNS</ExternalLink> as DNS resolver to improve privacy and security. Using Unbound broke the dependency of DNS providers like Google, Cloudflare, ...
- <ExternalLink href="https://docs.openwebui.com/">Open WebUI</ExternalLink> as my AI API client. I use <ExternalLink href="https://openrouter.ai/">Open Router</ExternalLink> as the pay-as-you-use payment model allows me to save money on expensive AI plan without any limit about the model choice. Furthermore, it acts like a proxy, so I'm not being tracker by the API provider(the context will still be leaked obviously).

All these services(except DNS that's on Raspberry PI 4) are behind a wireguard VPN hosted on the VPS to improve security and privacy. You can also use Tailscale or other P2P VPN solutions if you don't want to manage your own VPN server.

Using a VPN permit us to avoid exposing services directly to the internet, reducing the attack surface. In case of VPS failure, Contabo gives an emergency console useful if SSH is unavailable.

## Make data invisible to the provider

Most of the people that doesn't approve the self-hosting on VPS, say that your data can be read by the VPS provider like Google or any other cloud company does.

That's forbidden by ToS of almost all VPS provider, except for legal reasons. If you still doesn't rely on provider ToS, like me, you can make a LUKS encrypted disk for your data, OS will remain unencrypted but assuming that OS doesn't have any backdoor, it's safe.

So as first step, boot your VPS in rescue mode and resize the ext4 filesystem:

```shell
e2fsck -f /dev/sdXn
resize2fs /dev/sdXn 20G
```

- Run `fdisk /dev/sdX`, delete the existing OS partition and create a new one with 20GB of space for your OS formatted in the original filesystem. **Don't remove the ext4 signature**
- Create another partition with the remaining space and don't format it.
- Save changes to disk
- Check the partition using `e2fsck -f /dev/sdXn`

Where `/dev/sdXn` is the partition you created for your OS.

Now reboot your VPS in normal mode and setup LUKS on the unformatted partition(assuming you are logged in as root, otherwise use `sudo cmd`):

```shell
apt update
apt upgrade # Upgrade the packages to avoid any security issue
apt install cryptsetup
cryptsetup luksFormat /dev/sdXn
cryptsetup open /dev/sdXn my_encrypted_disk
mkfs.ext4 /dev/mapper/my_encrypted_disk  # you can use BTRFS if you want to use subvolume or snapshot features
mount /dev/mapper/my_encrypted_disk /mnt
```

Where `/dev/sdXn` is the partition you created for your data.

Now you can mount partition and use it for your data. Remember to save the passphrase in a safe place, if you lose it, you will lose your data.

**With the following setup your will need to unlock your device everytime the VPS reboot(usually any VPS with a good provider doesn't have stability issues)**

## Secure the VPS: Firewall and VPN

First of all, you have to secure your VPS. The first step is to set up a firewall, I use `ufw` as it's easy to use and configure:

```shell
apt install ufw
ufw allow ssh # If you don't want to secure SSH with VPN
ufw default deny incoming
ufw default allow outgoing
```

**Don't enable the firewall as it will break your SSH session**

Now I will show the installation of Wireguard VPN, if you prefer an hosted solution like Tailscale, skip this section and jump to firewall setup.

For the Wireguard setup I use the <ExternalLink href="https://github.com/angristan/wireguard-install>wireguard-install">wireguard-install</ExternalLink> script that automate the installation and configuration of Wireguard. If you want a GUI dashboard you can use <ExternalLink href="https://github.com/donaldzou/WGDashboard">WGDashboard</ExternalLink>.

Run the script and follow the setup then add a user by running again the script after installation:

```shell
apt install curl
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
./wireguard-install.sh
```
**Annotate the listen port of Wireguard**

Transfer the generated config file to your device and import it in your Wireguard client.

Try to ping the Wireguard interface IP of your VPS to check if the VPN is working.

Now you can enable the firewall(run this step only if the VPN works as it will break your SSH connection):

```shell
ufw allow <WIREGUARD_PORT>/udp
ufw allow from any to <WIREGUARD_IP> port 22  # Enable SSH from VPN only
ufw allow 80 # Allow HTTP for certbot
ufw enable
```

Where `<WIREGUARD_PORT>` is the port you annotated before and `<WIREGUARD_IP>` is the Wireguard interface IP of your VPS(usually `wg0`).

## Prepare the SSL certificate

For this step, I assume you have a domain name or a DDNS for configured on your VPS IP address.

Nextcloud AIO and Vaultwarden requires an SSL certificate to work properly. You can use <ExternalLink href="https://letsencrypt.org/">Let's Encrypt</ExternalLink> to get a free SSL certificate.

Install certbot:

```shell
apt install certbot
```

Now you can generate the SSL certificate:

```shell
certbot certonly --standalone --config-dir /mnt/nginx/ssl/config --work-dir /mnt/nginx/ssl --logs-dir /mnt/nginx/logs -d yourdomain.com 
```

## How I manage all this services?

Managing all this services can be painful if you don't use a container based solution. In my case I use docker-compose as it's easy to manage and configure. I wouldn't recommend using more complex solution like Kubernetes as it introduce useless complexity and it's really difficult to manage. If you want a GUI to manage the containers, <ExternalLink href="https://docs.portainer.io/">Portainer CE</ExternalLink> works well.

Firstly install docker and docker-compose:

```shell
apt install docker.io docker-compose
systemctl enable --now docker
```

Create the following `docker-compose.yaml` file under `$HOME/home_server/docker-compose.yml`:

```yaml
services:
  nextcloud-aio-mastercontainer:
    image: ghcr.io/nextcloud-releases/all-in-one:latest
    init: true
    restart: always
    network_mode: bridge 
    container_name: nextcloud-aio-mastercontainer # This line is not allowed to be changed as otherwise AIO will not work correctly
    volumes:
      - nextcloud_aio_mastercontainer:/mnt/docker-aio-config # This line is not allowed to be changed as otherwise the built-in backup solution will not work
      - /var/run/docker.sock:/var/run/docker.sock:ro # May be changed on macOS, Windows or docker rootless. See the applicable documentation. If adjusting, don't forget to also set 'WATCHTOWER_DOCKER_SOCKET_PATH'!
    ports:
      - 8080:8080
    environment: 
      APACHE_PORT: 11000
      APACHE_IP_BINDING: 127.0.0.1
      NEXTCLOUD_DATADIR: /mnt/ncdata # ust this value after the initial Nextcloud installation is done! See https://github.com/nextcloud/all-in-one#how-to-change-the-default-location-of-nextclouds-datadir
      NEXTCLOUD_MOUNT: /mnt/ # Allows the Nextcloud container to access the chosen directory on the host. See https://github.com/nextcloud/all-in-one#how-to-allow-the-nextcloud-container-to-access-directories-on-the-host
  
  vaultwarden:
    container_name: vaultwarden
    image: vaultwarden/server:latest
    restart: unless-stopped
    volumes:
      - /mnt/bitwarden_data/:/data/
    ports:
      - 12000:80
    environment:
#      SIGNUPS_ALLOWED: false # You can uncomment this after the first setup to disable new user registration
      LOGIN_RATELIMIT_MAX_BURST: 10
      LOGIN_RATELIMIT_SECONDS: 60
  
  nginx:
    image: nginx:alpine
    container_name: my_nginx
    restart: unless-stopped
    network_mode: host 
    volumes:
      - /mnt/nginx/nginx.conf:/etc/nginx/nginx.conf
      - /mnt/nginx/conf.d/:/etc/nginx/conf.d/
      - /mnt/nginx/logs/:/var/log/nginx
      - /mnt/nginx/ssl:/etc/ssl

  jellyfin:
    image: jellyfin/jellyfin
    container_name: jellyfin
    network_mode: 'host'
    volumes:
      - /mnt/jellyfin_config:/config
      - /mnt/jellyfin_cache:/cache
      - type: bind
        source: /mnt/jellyfin
        target: /media
      - type: bind
        source: /mnt/fonts
        target: /usr/local/share/fonts/custom
        read_only: true
    restart: 'unless-stopped'
    extra_hosts:
      - 'host.docker.internal:host-gateway'
  
  transmission:
    image: lscr.io/linuxserver/transmission:latest
    container_name: transmission
    environment:
      - PUID=0
      - PGID=0
      - TZ=Etc/UTC
    volumes:
      - /mnt/transmission:/config
      - /mnt/jellyfin:/downloads # I use the same folder of jellyfin to have the downloaded files available in jellyfin. You can change it if you want
    ports:
      - 9091:9091
      - 51413:51413 # Default bittorrent port
      - 51413:51413/udp
    restart: unless-stopped

  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3001:8080"
    volumes:
      - /mnt/open_webui:/app/backend/data

volumes: # If you want to store the data on a different drive, see https://github.com/nextcloud/all-in-one#how-to-store-the-filesinstallation-on-a-separate-drive
  nextcloud_aio_mastercontainer:
    name: nextcloud_aio_mastercontainer
    driver: local
    driver_opts:
      type: none
      device: /mnt/nextcloud-master
      o: bind
```

Now create the following `nginx.conf` file under `/mnt/nginx/nginx.conf`:

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    keepalive_timeout  65;
    resolver 127.0.0.11;
    include /etc/nginx/conf.d/*.conf;
}
```

Then create the necessary nginx folders: 

```shell
mkdir -p /mnt/nginx/ssl /mnt/nginx/ssl/config /mnt/nginx/logs /mnt/nginx/conf.d
curl -L https://ssl-config.mozilla.org/ffdhe2048.txt -o /mnt/nginx/ssl/dhparam
```

### Configuring nginx for Nextcloud AIO

Create the following `nextcloud-aio.conf` file under `/mnt/nginx/conf.d/nextcloud-aio.conf`:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
     # Don't use 80 as it's used by certbot
     # Most of modern browsers automatically switch to HTTPS automatically

     listen 443 ssl;      # for nginx v1.25.1+
     listen [::]:443 ssl; # for nginx v1.25.1+ - keep comment to disable IPv6
     http2 on;            # uncomment to enable HTTP/2 - supported on nginx v1.25.1+

    http3 on;                                 # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    quic_gso on;                              # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    quic_retry on;                            # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    add_header Alt-Svc 'h3=":443"; ma=86400'; # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+

    proxy_buffering off;
    proxy_request_buffering off;

    client_max_body_size 0;
    client_body_buffer_size 512k;
    http3_stream_buffer_size 512k; # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    proxy_read_timeout 86400s;
    
    server_name mydomain.com; # Change to your domain

    location / {
        proxy_pass http://127.0.0.1:11000$request_uri; # Adjust to match APACHE_PORT and APACHE_IP_BINDING. See https://github.com/nextcloud/all-in-one/blob/main/reverse-proxy.md#adapting-the-sample-web-server-configurations-below

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header Early-Data $ssl_early_data;

        # Websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }

    ssl_certificate /etc/ssl/config/live/mydomain.com/fullchain.pem;   # managed by certbot on host machine
    ssl_certificate_key /etc/ssl/config/live/mydomain.com/privkey.pem; # managed by certbot on host machine

    ssl_dhparam /etc/ssl/dhparam;

    ssl_early_data on;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ecdh_curve x25519:x448:secp521r1:secp384r1:secp256r1;

    ssl_prefer_server_ciphers on;
    ssl_conf_command Options PrioritizeChaCha;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256;
}
```

This will configure nginx to proxy requests to Nextcloud AIO and handle SSL.

This is necessary because Nextcloud and Vaultwarden will share the same certificate.

### Configuring nginx for Vaultwarden

Create the following `vaultwarden.conf` file under `/mnt/nginx/conf.d/vaultwarden.conf`:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
     listen 13000 ssl;      # for nginx v1.25.1+
     listen [::]:13000 ssl; # for nginx v1.25.1+ - keep comment to disable IPv6
     http2 on;            # uncomment to enable HTTP/2 - supported on nginx v1.25.1+

    http3 on;                                 # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    quic_gso on;                              # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    quic_retry on;                            # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    add_header Alt-Svc 'h3=":443"; ma=86400'; # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+

    proxy_buffering off;
    proxy_request_buffering off;

    client_max_body_size 0;
    client_body_buffer_size 512k;
    http3_stream_buffer_size 512k; # uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+
    proxy_read_timeout 86400s;

    server_name mydomain.com; # Change to your domain

    location / {
        proxy_pass http://127.0.0.1:12000$request_uri; # Adjust to match APACHE_PORT and APACHE_IP_BINDING. See https://github.com/nextcloud/all-in-one/blob/main/reverse-proxy.md#adapting-the-sample-web-server-configurations-below

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header Early-Data $ssl_early_data;

        # Websocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }

    ssl_certificate /etc/ssl/config/live/mydomain.com/fullchain.pem;   # managed by certbot on host machine
    ssl_certificate_key /etc/ssl/config/live/mydomain.com/privkey.pem; # managed by certbot on host machine

    ssl_dhparam /etc/ssl/dhparam; # 

    ssl_early_data on;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ecdh_curve x25519:x448:secp521r1:secp384r1:secp256r1;

    ssl_prefer_server_ciphers on;
    ssl_conf_command Options PrioritizeChaCha;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256;
}
```

The other services doesn't need a reverse proxy as they don't strictly need SSL certificate as we are under VPN. If you still want to use nginx as reverse proxy for them, you can create similar configuration files changing the ports and the `proxy_pass` directive.

Now you can set up the firewall and start the services by running:

```shell
ufw allow from any to <WIREGUARD_IP> port 13000  # Allow vaultwarden on VPN
ufw allow from any to <WIREGUARD_IP> port 443  # Enable Nextcloud from VPN only
ufw allow from any to <WIREGUARD_IP> port 8096  # Enable Jellyfin from VPN only
ufw allow from any to <WIREGUARD_IP> port 3001  # Enable OpenWebUI from VPN only
ufw allow from any to <WIREGUARD_IP> port 9091  # Enable Transmission from VPN only
docker-compose up -d
```

Now you will have the following services on the corresponding port:

- `8081`: Vaultwarden
- `443`: Nextcloud
- `8096`: Jellyfin
- `3001`: OpenWebUI
- `9091`: Transmission

You can set up each service by accessing to the corresponding port.

Configuring each service is out of the scope of this article, but you can find a lot of tutorials online. I will just give you the path to use for the data of each service:

- Nextcloud: No path required in the setup
- Vaultwarden: No path required in the setup
- Jellyfin: `/media` for media files
- OpenWebUI: No path required in the setup
- Transmission: `/downloads` for downloaded files. The files will be available in Jellyfin under `/media`

**In order to use Nextcloud and Bitwarden you must set up DNS rewrite from `yourdomain.com` to your VPS DNS interface IP address in AdGuardHome, otherwise Nextcloud AIO will not work.** This happens because Nextcloud AIO and Bitwarden needs a valid SSL certificate to work properly and accessing directly from VPS IP is not supported in HTTPS.

## The DNS resolver

I use my Raspberry PI 4 as DNS resolver and ad-blocker because VPS introduces an important latency in the queries and you can't host a DNS on a public IP so you would need to make a NAT masquerade to access DNS in your private home.

To improve privacy and security, I use Unbound as DNS resolver. It will avoid using third party DNS providers like Google or Cloudflare that can log your queries. For the anti-tracking features, I use AdGuard Home. 

Firstly install Unbound on the Raspberry PI 4(or any other machine you want):

```shell
apt install unbound
```

Create the following configuration file under `/etc/unbound/unbound.conf`:

```yaml
include-toplevel: "/etc/unbound/unbound.conf.d/*.conf"
server:
    #logging
    # verbosity number, 0 is least verbose. 1 is default.
    verbosity: 2

    #log to stderr
    use-syslog: no
    logfile: ""

    # print UTC timestamp in ascii to logfile, default is epoch in seconds.
    log-time-ascii: yes

    # print one line with time, IP, name, type, class for every query.
    log-queries: yes

    # log with tag 'query' and 'reply' instead of 'info' for
    # filtering log-queries and log-replies from the log.
    log-tag-queryreply: yes

    #binding interface and port
    # specify the interfaces and port to answer queries from by ip-address.
    interface: 0.0.0.0
    port: 5335
    # control which clients are allowed to make (recursive) queries
    access-control: 127.0.0.0/8 allow

    #disable IPv6 if not needed
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    do-ip6: no

    #hardening
    # Harden against out of zone rrsets, to avoid spoofing attempts.
    harden-glue: yes

    # Harden against receiving dnssec-stripped data
    harden-dnssec-stripped: yes

    # Use 0x20-encoded random bits in the query to foil spoof attempts.
    use-caps-for-id: yes

    # enable to not answer id.server and hostname.bind queries.
    hide-identity: yes

    # enable to not answer version.server and version.bind queries.
    hide-version: yes

    # Sent minimum amount of information to upstream servers to enhance privacy.
    qname-minimisation: yes
    
    # Aggressive NSEC uses the DNSSEC NSEC chain to synthesize NXDOMAI
    aggressive-nsec: yes

    # If nonzero, unwanted replies are not only reported in statistics,
    # but also a running total is kept per thread. If it reaches the
    # threshold, a warning is printed and a defensive action is taken,
    # the cache is cleared to flush potential poison out of it.
    # A suggested value is 10000000, the default is 0 (turned off).
    unwanted-reply-threshold: 10000000

    #efficency
    prefetch: yes

    # Serve expired responses from cache, with serve-expired-reply-ttl in
    # the response, and then attempt to fetch the data afresh.
    serve-expired: yes
    
    # Limit serving of expired responses to configured seconds after
    # expiration.
    serve-expired-ttl: 86400

    # EDNS reassembly buffer to advertise to UDP peers (the actual buffer
    # is set with msg-buffer-size).
    edns-buffer-size: 1232

    # the time to live (TTL) value lower bound, in seconds. Default 0.
    # If more than an hour could easily give trouble due to stale data.
    cache-min-ttl: 3600

    # the time to live (TTL) value cap for RRsets and messages in the
    # cache. Items are not cached for longer. In seconds.
    cache-max-ttl: 86400

    # the amount of memory to use for the RRset cache.
    rrset-cache-size: 8m

    # the amount of memory to use for the message cache.
    msg-cache-size: 4m

    # number of threads to create. 1 disables threading.
    num-threads: 4
    
    # the number of slabs to use for the RRset cache.
    rrset-cache-slabs: 4
    
    # the number of slabs to use for the message cache.
    msg-cache-slabs: 4
```

Now we can install AdGuard Home:

```shell
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
/opt/AdGuardHome/AdGuardHome -s install
/opt/AdGuardHome/AdGuardHome -s start
```

Now you can access to AdGuardHome web interface on port `3000`, set up AdGuardHome and set unbound at 127.0.0.1:5335 as upstream DNS server.

Finally, set up your router to use the Raspberry PI 4 as DNS server for your network.

Remember that if you wanna use Nextcloud you **must** set up DNS rewrite from `yourdomain.com` to your VPS DNS interface IP address in AdGuardHome, otherwise Nextcloud AIO will not work.

To use Raspberry PI 4 as DNS resolver for clients connected to the VPN, you have to change the DNS server in the Wireguard config file under the DNS variable by putting the Raspberry PI VPN interface IP(generate another Wireguard config in the VPS if necessary by running `./wireguard-install.sh`).

## Conclusion

Self-hosting is not for everyone, it requires time and patience to set up and maintain the services, but it gives you freedom and control over your data. If you are willing to spend some time to learn and manage your own services, I highly recommend you to try self-hosting.

This article is not exhaustive, there are many other things to consider like backup, security, ... but I hope it can be a good starting point for your self-hosting journey. In the future I will write more articles about my backup strategy and how to improve Jellyfin with [AudioMuse-AI](https://github.com/NeptuneHub/AudioMuse-AI)
