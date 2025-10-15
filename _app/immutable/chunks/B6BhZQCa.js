import"./DsnmJJEf.js";import"./QsjHIwgP.js";import{H as Cs,I as Hs,p as ss,f as _,t as j,b as l,c as ns,h as Z,d as s,s as a,g as n,bg as Ns,be as Es,aL as Ds,a as Rs,aQ as e,ar as d}from"./BErm-MzH.js";import{r as as,d as w,h as c}from"./B4wdVWwy.js";import{l as Gs,s as $s}from"./DmgZT4If.js";function Os(y,p,r,i,v){Cs&&Hs();var u=p.$$slots?.[r],k=!1;u===!0&&(u=p.children,k=!0),u===void 0||u(y,k?()=>i:i)}var Us=_('<header class="mb-8"><div class="mx-auto max-w-3xl px-4 py-6"><h1 class="text-3xl font-bold text-blue-700"> </h1> <img class="h-60 w-full"/> <h3 class="mt-2 text-xl"> </h3></div></header>');function Vs(y,p){ss(p,!0);var r=Us(),i=s(r),v=s(i),u=s(v,!0);n(v);var k=a(v,2),f=a(k,2),b=s(f,!0);n(f),n(i),n(r),j(g=>{Z(u,p.title),w(k,"src",g),w(k,"alt",p.title+" image"),Z(b,p.description)},[()=>as(p.image)]),l(y,r),ns()}var Ls=_('<link rel="stylesheet"/>'),Ws=_('<div class="min-h-screen bg-gray-50 font-sans text-gray-900"><!> <main class="mx-auto max-w-3xl px-4 pb-16"><article class="prose prose-lg prose-blue"><!></article></main></div>');function qs(y,p){ss(p,!0);var r=Ws();Ns(f=>{var b=Ls();j(g=>{Es.title=p.title,w(b,"href",g)},[()=>as("/prism-atom-dark.css")]),l(f,b)});var i=s(r);Vs(i,{get title(){return p.title},get author(){return p.author},get description(){return p.description},get image(){return p.thumbnail}});var v=a(i,2),u=s(v),k=s(u);Os(k,p,"default",{}),n(u),n(v),n(r),l(y,r),ns()}var Ms=_('<a target="_blank" rel="noopener noreferrer"><!></a>');function m(y,p){var r=Ms(),i=s(r);Ds(i,()=>p.children),n(r),j(()=>w(r,"href",p.href)),l(y,r)}const B={layout:"blog_article",title:"Self Hosting Journey",author:"Andrea Canale",description:"A little story about my experience with self-hosting and some advices.",thumbnail:"/nextcloud-gmbh-logo-vector.svg"},{layout:Js,title:Ks,author:Zs,description:sn,thumbnail:nn}=B;var Fs=_(`<h2>Why?</h2> <p>I started with self-hosting about 5 years ago when I set up a personal cloud with my Raspberry PI 4, that includes Jellyfin and a simple file manager to share files between my devices.</p> <p>About 2 years ago I started to becoming aware of privacy problems of the various services I was using, so I started to look for alternatives and I found out that self-hosting could be a good solution for me.</p> <p>Self-hosting requires a lot of free time, especially during the first setup, but it gives you a lot of freedom and control over your data. After the first setup, the things usually goes more smoothly, but you have to be ready to face some problems and to spend some time to fix them(especially if you host your machine at home).</p> <p>This article requires knowledge about Linux administration, Docker and networking. If you are not familiar with these topics, I suggest you to make some pratice with simpler setup before trying to set up a complex server like the one in the article.</p> <h2>My setup</h2> <p>When I started with self-hosting, I thought that having hardware in my homelab could be a good idea but with the time I have several issues with hardware problems so I decided to move to a VPS.</p> <p>Actual setup:</p> <ul><li>VPS from <!> with 3vCPUs core(6 threads), 8GB RAM, 400GB SSD and 300 Mbit/s connection with 32TB out and unlimited in. I use Debian 13 as OS but you can choose also Red Hat derivates or upload your ISO.</li> <li>Raspberry PI 4B with 2 1TB SSD BTRFS RAID 1 for VPS backup + my laptop backup</li></ul> <p>I think that VPS is a good solution to avoid hardware problems and stability issues. The price is acceptable in my opinion, about 100 euro/year. Using a VPS require a bit more work to secure it properly, but it’s not a big deal.</p> <h2>Services</h2> <p>I actually host the following services:</p> <ul><li><!> for file sharing, calendar, contacts and notes. It replaces entirely the Google Workspace except for Gmail(I use Proton Mail for that).</li> <li><!> for media streaming. It replaces Spotify and Netflix(if you have some film/series to upload).</li> <li><!> for password management across every device. It's easier to set up than Bitwarden, and it requires less resources.</li> <li><!> for network-wide ad blocking and tracking protection.</li> <li><!> as DNS resolver to improve privacy and security. Using Unbound broke the dependency of DNS providers like Google, Cloudflare, ...</li> <li><!> as my AI API client. I use <!> as the pay-as-you-use payment model allows me to save money on expensive AI plan without any limit about the model choice. Furthermore, it acts like a proxy, so I'm not being tracker by the API provider(the context will still be leaked obviously).</li></ul> <p>All these services(except DNS that’s on Raspberry PI 4) are behind a wireguard VPN hosted on the VPS to improve security and privacy. You can also use Tailscale or other P2P VPN solutions if you don’t want to manage your own VPN server.</p> <p>Using a VPN permit us to avoid exposing services directly to the internet, reducing the attack surface. In case of VPS failure, Contabo gives an emergency console useful if SSH is unavailable.</p> <h2>Make data invisible to the provider</h2> <p>Most of the people that doesn’t approve the self-hosting on VPS, say that your data can be read by the VPS provider like Google or any other cloud company does.</p> <p>That’s forbidden by ToS of almost all VPS provider, except for legal reasons. If you still doesn’t rely on provider ToS, like me, you can make a LUKS encrypted disk for your data, OS will remain unencrypted but assuming that OS doesn’t have any backdoor, it’s safe.</p> <p>So as first step, boot your VPS in rescue mode and resize the ext4 filesystem:</p> <pre class="language-shell"><!></pre> <ul><li>Run <code>fdisk /dev/sdX</code>, delete the existing OS partition and create a new one with 20GB of space for your OS formatted in the original filesystem. <strong>Don’t remove the ext4 signature</strong></li> <li>Create another partition with the remaining space and don’t format it.</li> <li>Save changes to disk</li> <li>Check the partition using <code>e2fsck -f /dev/sdXn</code></li></ul> <p>Where <code>/dev/sdXn</code> is the partition you created for your OS.</p> <p>Now reboot your VPS in normal mode and setup LUKS on the unformatted partition(assuming you are logged in as root, otherwise use <code>sudo cmd</code>):</p> <pre class="language-shell"><!></pre> <p>Where <code>/dev/sdXn</code> is the partition you created for your data.</p> <p>Now you can mount partition and use it for your data. Remember to save the passphrase in a safe place, if you lose it, you will lose your data.</p> <p><strong>With the following setup your will need to unlock your device everytime the VPS reboot(usually any VPS with a good provider doesn’t have stability issues)</strong></p> <h2>Secure the VPS: Firewall and VPN</h2> <p>First of all, you have to secure your VPS. The first step is to set up a firewall, I use <code>ufw</code> as it’s easy to use and configure:</p> <pre class="language-shell"><!></pre> <p><strong>Don’t enable the firewall as it will break your SSH session</strong></p> <p>Now I will show the installation of Wireguard VPN, if you prefer an hosted solution like Tailscale, skip this section and jump to firewall setup.</p> <p>For the Wireguard setup I use the <!> script that automate the installation and configuration of Wireguard. If you want a GUI dashboard you can use <!>.</p> <p>Run the script and follow the setup then add a user by running again the script after installation:</p> <pre class="language-shell"><!></pre> <p><strong>Annotate the listen port of Wireguard</strong></p> <p>Transfer the generated config file to your device and import it in your Wireguard client.</p> <p>Try to ping the Wireguard interface IP of your VPS to check if the VPN is working.</p> <p>Now you can enable the firewall(run this step only if the VPN works as it will break your SSH connection):</p> <pre class="language-shell"><!></pre> <p>Where <code>&lt;WIREGUARD_PORT&gt;</code> is the port you annotated before and <code>&lt;WIREGUARD_IP&gt;</code> is the Wireguard interface IP of your VPS(usually <code>wg0</code>).</p> <h2>Prepare the SSL certificate</h2> <p>For this step, I assume you have a domain name or a DDNS for configured on your VPS IP address.</p> <p>Nextcloud AIO and Vaultwarden requires an SSL certificate to work properly. You can use <!> to get a free SSL certificate.</p> <p>Install certbot:</p> <pre class="language-shell"><!></pre> <p>Now you can generate the SSL certificate:</p> <pre class="language-shell"><!></pre> <h2>How I manage all this services?</h2> <p>Managing all this services can be painful if you don’t use a container based solution. In my case I use docker-compose as it’s easy to manage and configure. I wouldn’t recommend using more complex solution like Kubernetes as it introduce useless complexity and it’s really difficult to manage. If you want a GUI to manage the containers, <!> works well.</p> <p>Firstly install docker and docker-compose:</p> <pre class="language-shell"><!></pre> <p>Create the following <code>docker-compose.yaml</code> file under <code>$HOME/home_server/docker-compose.yml</code>:</p> <pre class="language-yaml"><!></pre> <p>Now create the following <code>nginx.conf</code> file under <code>/mnt/nginx/nginx.conf</code>:</p> <pre class="language-nginx"><!></pre> <p>Then create the necessary nginx folders:</p> <pre class="language-shell"><!></pre> <h3>Configuring nginx for Nextcloud AIO</h3> <p>Create the following <code>nextcloud-aio.conf</code> file under <code>/mnt/nginx/conf.d/nextcloud-aio.conf</code>:</p> <pre class="language-nginx"><!></pre> <p>This will configure nginx to proxy requests to Nextcloud AIO and handle SSL.</p> <p>This is necessary because Nextcloud and Vaultwarden will share the same certificate.</p> <h3>Configuring nginx for Vaultwarden</h3> <p>Create the following <code>vaultwarden.conf</code> file under <code>/mnt/nginx/conf.d/vaultwarden.conf</code>:</p> <pre class="language-nginx"><!></pre> <p>The other services doesn’t need a reverse proxy as they don’t strictly need SSL certificate as we are under VPN. If you still want to use nginx as reverse proxy for them, you can create similar configuration files changing the ports and the <code>proxy_pass</code> directive.</p> <p>Now you can set up the firewall and start the services by running:</p> <pre class="language-shell"><!></pre> <p>Now you will have the following services on the corresponding port:</p> <ul><li><code>8081</code>: Vaultwarden</li> <li><code>443</code>: Nextcloud</li> <li><code>8096</code>: Jellyfin</li> <li><code>3001</code>: OpenWebUI</li> <li><code>9091</code>: Transmission</li></ul> <p>You can set up each service by accessing to the corresponding port.</p> <p>Configuring each service is out of the scope of this article, but you can find a lot of tutorials online. I will just give you the path to use for the data of each service:</p> <ul><li>Nextcloud: No path required in the setup</li> <li>Vaultwarden: No path required in the setup</li> <li>Jellyfin: <code>/media</code> for media files</li> <li>OpenWebUI: No path required in the setup</li> <li>Transmission: <code>/downloads</code> for downloaded files. The files will be available in Jellyfin under <code>/media</code></li></ul> <p><strong>In order to use Nextcloud and Bitwarden you must set up DNS rewrite from <code>yourdomain.com</code> to your VPS DNS interface IP address in AdGuardHome, otherwise Nextcloud AIO will not work.</strong> This happens because Nextcloud AIO and Bitwarden needs a valid SSL certificate to work properly and accessing directly from VPS IP is not supported in HTTPS.</p> <h2>The DNS resolver</h2> <p>I use my Raspberry PI 4 as DNS resolver and ad-blocker because VPS introduces an important latency in the queries and you can’t host a DNS on a public IP so you would need to make a NAT masquerade to access DNS in your private home.</p> <p>To improve privacy and security, I use Unbound as DNS resolver. It will avoid using third party DNS providers like Google or Cloudflare that can log your queries. For the anti-tracking features, I use AdGuard Home.</p> <p>Firstly install Unbound on the Raspberry PI 4(or any other machine you want):</p> <pre class="language-shell"><!></pre> <p>Create the following configuration file under <code>/etc/unbound/unbound.conf</code>:</p> <pre class="language-yaml"><!></pre> <p>Now we can install AdGuard Home:</p> <pre class="language-shell"><!></pre> <p>Now you can access to AdGuardHome web interface on port <code>3000</code>, set up AdGuardHome and set unbound at 127.0.0.1:5335 as upstream DNS server.</p> <p>Finally, set up your router to use the Raspberry PI 4 as DNS server for your network.</p> <p>Remember that if you wanna use Nextcloud you <strong>must</strong> set up DNS rewrite from <code>yourdomain.com</code> to your VPS DNS interface IP address in AdGuardHome, otherwise Nextcloud AIO will not work.</p> <p>To use Raspberry PI 4 as DNS resolver for clients connected to the VPN, you have to change the DNS server in the Wireguard config file under the DNS variable by putting the Raspberry PI VPN interface IP(generate another Wireguard config in the VPS if necessary by running <code>./wireguard-install.sh</code>).</p> <h2>Conclusion</h2> <p>Self-hosting is not for everyone, it requires time and patience to set up and maintain the services, but it gives you freedom and control over your data. If you are willing to spend some time to learn and manage your own services, I highly recommend you to try self-hosting.</p> <p>This article is not exhaustive, there are many other things to consider like backup, security, … but I hope it can be a good starting point for your self-hosting journey. In the future I will write more articles about my backup strategy and how to improve Jellyfin with <a href="https://github.com/NeptuneHub/AudioMuse-AI" rel="nofollow">AudioMuse-AI</a></p>`,1);function Xs(y,p){const r=Gs(p,["children","$$slots","$$events","$$legacy"]);qs(y,$s(()=>r,()=>B,{children:(i,v)=>{var u=Fs(),k=a(Rs(u),16),f=s(k),b=a(s(f));m(b,{href:"https://contabo.com/",children:(t,h)=>{e();var o=d("Contabo");l(t,o)}}),e(),n(f),e(2),n(k);var g=a(k,8),x=s(g),es=s(x);m(es,{href:"https://nextcloud.com/",children:(t,h)=>{e();var o=d("Nextcloud");l(t,o)}}),e(),n(x);var S=a(x,2),ts=s(S);m(ts,{href:"https://jellyfin.org/",children:(t,h)=>{e();var o=d("Jellyfin");l(t,o)}}),e(),n(S);var I=a(S,2),os=s(I);m(os,{href:"https://github.com/dani-garcia/vaultwarden",children:(t,h)=>{e();var o=d("VaultWarden");l(t,o)}}),e(),n(I);var P=a(I,2),ps=s(P);m(ps,{href:"https://adguard.com/en/adguard-home/overview.html",children:(t,h)=>{e();var o=d("AdGuard Home");l(t,o)}}),e(),n(P);var A=a(P,2),cs=s(A);m(cs,{href:"https://nlnetlabs.nl/projects/unbound/about/",children:(t,h)=>{e();var o=d("Unbound DNS");l(t,o)}}),e(),n(A);var Q=a(A,2),Y=s(Q);m(Y,{href:"https://docs.openwebui.com/",children:(t,h)=>{e();var o=d("Open WebUI");l(t,o)}});var ls=a(Y,2);m(ls,{href:"https://openrouter.ai/",children:(t,h)=>{e();var o=d("Open Router");l(t,o)}}),e(),n(Q),n(g);var T=a(g,14),rs=s(T);c(rs,()=>`<code class="language-shell">e2fsck <span class="token parameter variable">-f</span> /dev/sdXn
resize2fs /dev/sdXn 20G</code>`),n(T);var C=a(T,8),is=s(C);c(is,()=>`<code class="language-shell"><span class="token function">apt</span> update
<span class="token function">apt</span> upgrade <span class="token comment"># Upgrade the packages to avoid any security issue</span>
<span class="token function">apt</span> <span class="token function">install</span> cryptsetup
cryptsetup luksFormat /dev/sdXn
cryptsetup <span class="token function">open</span> /dev/sdXn my_encrypted_disk
mkfs.ext4 /dev/mapper/my_encrypted_disk  <span class="token comment"># you can use BTRFS if you want to use subvolume or snapshot features</span>
<span class="token function">mount</span> /dev/mapper/my_encrypted_disk /mnt</code>`),n(C);var H=a(C,12),us=s(H);c(us,()=>`<code class="language-shell"><span class="token function">apt</span> <span class="token function">install</span> ufw
ufw allow <span class="token function">ssh</span> <span class="token comment"># If you don't want to secure SSH with VPN</span>
ufw default deny incoming
ufw default allow outgoing</code>`),n(H);var N=a(H,6),J=a(s(N));m(J,{href:"https://github.com/angristan/wireguard-install>wireguard-install",children:(t,h)=>{e();var o=d("wireguard-install");l(t,o)}});var ks=a(J,2);m(ks,{href:"https://github.com/donaldzou/WGDashboard",children:(t,h)=>{e();var o=d("WGDashboard");l(t,o)}}),e(),n(N);var E=a(N,4),ds=s(E);c(ds,()=>`<code class="language-shell"><span class="token function">apt</span> <span class="token function">install</span> <span class="token function">curl</span>
<span class="token function">curl</span> <span class="token parameter variable">-O</span> https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
<span class="token function">chmod</span> +x wireguard-install.sh
./wireguard-install.sh</code>`),n(E);var D=a(E,10),ms=s(D);c(ms,()=>`<code class="language-shell">ufw allow <span class="token operator">&lt;</span>WIREGUARD_PORT<span class="token operator">></span>/udp
ufw allow from any to <span class="token operator">&lt;</span>WIREGUARD_IP<span class="token operator">></span> port <span class="token number">22</span>  <span class="token comment"># Enable SSH from VPN only</span>
ufw allow <span class="token number">80</span> <span class="token comment"># Allow HTTP for certbot</span>
ufw <span class="token builtin class-name">enable</span></code>`),n(D);var R=a(D,8),hs=a(s(R));m(hs,{href:"https://letsencrypt.org/",children:(t,h)=>{e();var o=d("Let’s Encrypt");l(t,o)}}),e(),n(R);var G=a(R,4),ys=s(G);c(ys,()=>'<code class="language-shell"><span class="token function">apt</span> <span class="token function">install</span> certbot</code>'),n(G);var $=a(G,4),vs=s($);c(vs,()=>'<code class="language-shell">certbot certonly <span class="token parameter variable">--standalone</span> --config-dir /mnt/nginx/ssl/config --work-dir /mnt/nginx/ssl --logs-dir /mnt/nginx/logs <span class="token parameter variable">-d</span> yourdomain.com </code>'),n($);var O=a($,4),fs=a(s(O));m(fs,{href:"https://docs.portainer.io/",children:(t,h)=>{e();var o=d("Portainer CE");l(t,o)}}),e(),n(O);var U=a(O,4),gs=s(U);c(gs,()=>`<code class="language-shell"><span class="token function">apt</span> <span class="token function">install</span> docker.io <span class="token function">docker-compose</span>
systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> <span class="token function">docker</span></code>`),n(U);var V=a(U,4),bs=s(V);c(bs,()=>`<code class="language-yaml"><span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">nextcloud-aio-mastercontainer</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> ghcr.io/nextcloud<span class="token punctuation">-</span>releases/all<span class="token punctuation">-</span>in<span class="token punctuation">-</span>one<span class="token punctuation">:</span>latest
    <span class="token key atrule">init</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">network_mode</span><span class="token punctuation">:</span> bridge 
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> nextcloud<span class="token punctuation">-</span>aio<span class="token punctuation">-</span>mastercontainer <span class="token comment"># This line is not allowed to be changed as otherwise AIO will not work correctly</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> nextcloud_aio_mastercontainer<span class="token punctuation">:</span>/mnt/docker<span class="token punctuation">-</span>aio<span class="token punctuation">-</span>config <span class="token comment"># This line is not allowed to be changed as otherwise the built-in backup solution will not work</span>
      <span class="token punctuation">-</span> /var/run/docker.sock<span class="token punctuation">:</span>/var/run/docker.sock<span class="token punctuation">:</span>ro <span class="token comment"># May be changed on macOS, Windows or docker rootless. See the applicable documentation. If adjusting, don't forget to also set 'WATCHTOWER_DOCKER_SOCKET_PATH'!</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 8080<span class="token punctuation">:</span><span class="token number">8080</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span> 
      <span class="token key atrule">APACHE_PORT</span><span class="token punctuation">:</span> <span class="token number">11000</span>
      <span class="token key atrule">APACHE_IP_BINDING</span><span class="token punctuation">:</span> 127.0.0.1
      <span class="token key atrule">NEXTCLOUD_DATADIR</span><span class="token punctuation">:</span> /mnt/ncdata <span class="token comment"># ust this value after the initial Nextcloud installation is done! See https://github.com/nextcloud/all-in-one#how-to-change-the-default-location-of-nextclouds-datadir</span>
      <span class="token key atrule">NEXTCLOUD_MOUNT</span><span class="token punctuation">:</span> /mnt/ <span class="token comment"># Allows the Nextcloud container to access the chosen directory on the host. See https://github.com/nextcloud/all-in-one#how-to-allow-the-nextcloud-container-to-access-directories-on-the-host</span>
  
  <span class="token key atrule">vaultwarden</span><span class="token punctuation">:</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> vaultwarden
    <span class="token key atrule">image</span><span class="token punctuation">:</span> vaultwarden/server<span class="token punctuation">:</span>latest
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> unless<span class="token punctuation">-</span>stopped
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> /mnt/bitwarden_data/<span class="token punctuation">:</span>/data/
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 12000<span class="token punctuation">:</span><span class="token number">80</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
<span class="token comment">#      SIGNUPS_ALLOWED: false # You can uncomment this after the first setup to disable new user registration</span>
      <span class="token key atrule">LOGIN_RATELIMIT_MAX_BURST</span><span class="token punctuation">:</span> <span class="token number">10</span>
      <span class="token key atrule">LOGIN_RATELIMIT_SECONDS</span><span class="token punctuation">:</span> <span class="token number">60</span>
  
  <span class="token key atrule">nginx</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>alpine
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> my_nginx
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> unless<span class="token punctuation">-</span>stopped
    <span class="token key atrule">network_mode</span><span class="token punctuation">:</span> host 
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> /mnt/nginx/nginx.conf<span class="token punctuation">:</span>/etc/nginx/nginx.conf
      <span class="token punctuation">-</span> /mnt/nginx/conf.d/<span class="token punctuation">:</span>/etc/nginx/conf.d/
      <span class="token punctuation">-</span> /mnt/nginx/logs/<span class="token punctuation">:</span>/var/log/nginx
      <span class="token punctuation">-</span> /mnt/nginx/ssl<span class="token punctuation">:</span>/etc/ssl

  <span class="token key atrule">jellyfin</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> jellyfin/jellyfin
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> jellyfin
    <span class="token key atrule">network_mode</span><span class="token punctuation">:</span> <span class="token string">'host'</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> /mnt/jellyfin_config<span class="token punctuation">:</span>/config
      <span class="token punctuation">-</span> /mnt/jellyfin_cache<span class="token punctuation">:</span>/cache
      <span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> bind
        <span class="token key atrule">source</span><span class="token punctuation">:</span> /mnt/jellyfin
        <span class="token key atrule">target</span><span class="token punctuation">:</span> /media
      <span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> bind
        <span class="token key atrule">source</span><span class="token punctuation">:</span> /mnt/fonts
        <span class="token key atrule">target</span><span class="token punctuation">:</span> /usr/local/share/fonts/custom
        <span class="token key atrule">read_only</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> <span class="token string">'unless-stopped'</span>
    <span class="token key atrule">extra_hosts</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">'host.docker.internal:host-gateway'</span>
  
  <span class="token key atrule">transmission</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> lscr.io/linuxserver/transmission<span class="token punctuation">:</span>latest
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> transmission
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> PUID=0
      <span class="token punctuation">-</span> PGID=0
      <span class="token punctuation">-</span> TZ=Etc/UTC
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> /mnt/transmission<span class="token punctuation">:</span>/config
      <span class="token punctuation">-</span> /mnt/jellyfin<span class="token punctuation">:</span>/downloads <span class="token comment"># I use the same folder of jellyfin to have the downloaded files available in jellyfin. You can change it if you want</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 9091<span class="token punctuation">:</span><span class="token number">9091</span>
      <span class="token punctuation">-</span> 51413<span class="token punctuation">:</span><span class="token number">51413</span> <span class="token comment"># Default bittorrent port</span>
      <span class="token punctuation">-</span> 51413<span class="token punctuation">:</span>51413/udp
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> unless<span class="token punctuation">-</span>stopped

  <span class="token key atrule">openwebui</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> ghcr.io/open<span class="token punctuation">-</span>webui/open<span class="token punctuation">-</span>webui<span class="token punctuation">:</span>main
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">"3001:8080"</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> /mnt/open_webui<span class="token punctuation">:</span>/app/backend/data

<span class="token key atrule">volumes</span><span class="token punctuation">:</span> <span class="token comment"># If you want to store the data on a different drive, see https://github.com/nextcloud/all-in-one#how-to-store-the-filesinstallation-on-a-separate-drive</span>
  <span class="token key atrule">nextcloud_aio_mastercontainer</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> nextcloud_aio_mastercontainer
    <span class="token key atrule">driver</span><span class="token punctuation">:</span> local
    <span class="token key atrule">driver_opts</span><span class="token punctuation">:</span>
      <span class="token key atrule">type</span><span class="token punctuation">:</span> none
      <span class="token key atrule">device</span><span class="token punctuation">:</span> /mnt/nextcloud<span class="token punctuation">-</span>master
      <span class="token key atrule">o</span><span class="token punctuation">:</span> bind</code>`),n(V);var L=a(V,4),_s=s(L);c(_s,()=>`<code class="language-nginx"><span class="token directive"><span class="token keyword">user</span>  nginx</span><span class="token punctuation">;</span>
<span class="token directive"><span class="token keyword">worker_processes</span>  auto</span><span class="token punctuation">;</span>

<span class="token directive"><span class="token keyword">error_log</span>  /var/log/nginx/error.log notice</span><span class="token punctuation">;</span>
<span class="token directive"><span class="token keyword">pid</span>        /var/run/nginx.pid</span><span class="token punctuation">;</span>

<span class="token directive"><span class="token keyword">events</span></span> <span class="token punctuation">&#123;</span>
    <span class="token directive"><span class="token keyword">worker_connections</span>  <span class="token number">1024</span></span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span>

<span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">&#123;</span>
    <span class="token directive"><span class="token keyword">include</span>       /etc/nginx/mime.types</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">default_type</span>  application/octet-stream</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">log_format</span>  main  <span class="token string">'<span class="token variable">$remote_addr</span> - <span class="token variable">$remote_user</span> [<span class="token variable">$time_local]</span> "<span class="token variable">$request</span>" '</span>
                      <span class="token string">'<span class="token variable">$status</span> <span class="token variable">$body_bytes_sent</span> "<span class="token variable">$http_referer</span>" '</span>
                      <span class="token string">'"<span class="token variable">$http_user_agent</span>" "<span class="token variable">$http_x_forwarded_for</span>"'</span></span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">access_log</span>  /var/log/nginx/access.log  main</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">sendfile</span>        <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">keepalive_timeout</span>  <span class="token number">65</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">resolver</span> 127.0.0.11</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">include</span> /etc/nginx/conf.d/*.conf</span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span></code>`),n(L);var W=a(L,4),ws=s(W);c(ws,()=>`<code class="language-shell"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /mnt/nginx/ssl /mnt/nginx/ssl/config /mnt/nginx/logs /mnt/nginx/conf.d
<span class="token function">curl</span> <span class="token parameter variable">-L</span> https://ssl-config.mozilla.org/ffdhe2048.txt <span class="token parameter variable">-o</span> /mnt/nginx/ssl/dhparam</code>`),n(W);var q=a(W,6),xs=s(q);c(xs,()=>`<code class="language-nginx"><span class="token directive"><span class="token keyword">map</span> <span class="token variable">$http_upgrade</span> <span class="token variable">$connection_upgrade</span></span> <span class="token punctuation">&#123;</span>
    <span class="token directive"><span class="token keyword">default</span> upgrade</span><span class="token punctuation">;</span>
    '' <span class="token directive"><span class="token keyword">close</span></span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span>

<span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">&#123;</span>
     <span class="token comment"># Don't use 80 as it's used by certbot</span>
     <span class="token comment"># Most of modern browsers automatically switch to HTTPS automatically</span>

     <span class="token directive"><span class="token keyword">listen</span> <span class="token number">443</span> ssl</span><span class="token punctuation">;</span>      <span class="token comment"># for nginx v1.25.1+</span>
     <span class="token directive"><span class="token keyword">listen</span> [::]:443 ssl</span><span class="token punctuation">;</span> <span class="token comment"># for nginx v1.25.1+ - keep comment to disable IPv6</span>
     <span class="token directive"><span class="token keyword">http2</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>            <span class="token comment"># uncomment to enable HTTP/2 - supported on nginx v1.25.1+</span>

    <span class="token directive"><span class="token keyword">http3</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>                                 <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">quic_gso</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>                              <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">quic_retry</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>                            <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">add_header</span> Alt-Svc <span class="token string">'h3=":443"; ma=86400'</span></span><span class="token punctuation">;</span> <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>

    <span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">proxy_request_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">client_max_body_size</span> <span class="token number">0</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">client_body_buffer_size</span> <span class="token number">512k</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">http3_stream_buffer_size</span> <span class="token number">512k</span></span><span class="token punctuation">;</span> <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">proxy_read_timeout</span> <span class="token number">86400s</span></span><span class="token punctuation">;</span>
    
    <span class="token directive"><span class="token keyword">server_name</span> mydomain.com</span><span class="token punctuation">;</span> <span class="token comment"># Change to your domain</span>

    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">&#123;</span>
        <span class="token directive"><span class="token keyword">proxy_pass</span> http://127.0.0.1:11000<span class="token variable">$request_uri</span></span><span class="token punctuation">;</span> <span class="token comment"># Adjust to match APACHE_PORT and APACHE_IP_BINDING. See https://github.com/nextcloud/all-in-one/blob/main/reverse-proxy.md#adapting-the-sample-web-server-configurations-below</span>

        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-Port <span class="token variable">$server_port</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-Scheme <span class="token variable">$scheme</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-Proto <span class="token variable">$scheme</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Early-Data <span class="token variable">$ssl_early_data</span></span><span class="token punctuation">;</span>

        <span class="token comment"># Websocket</span>
        <span class="token directive"><span class="token keyword">proxy_http_version</span> 1.1</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Upgrade <span class="token variable">$http_upgrade</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Connection <span class="token variable">$connection_upgrade</span></span><span class="token punctuation">;</span>
    <span class="token punctuation">&#125;</span>

    <span class="token directive"><span class="token keyword">ssl_certificate</span> /etc/ssl/config/live/mydomain.com/fullchain.pem</span><span class="token punctuation">;</span>   <span class="token comment"># managed by certbot on host machine</span>
    <span class="token directive"><span class="token keyword">ssl_certificate_key</span> /etc/ssl/config/live/mydomain.com/privkey.pem</span><span class="token punctuation">;</span> <span class="token comment"># managed by certbot on host machine</span>

    <span class="token directive"><span class="token keyword">ssl_dhparam</span> /etc/ssl/dhparam</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">ssl_early_data</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_session_timeout</span> <span class="token number">1d</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_session_cache</span> shared:SSL:10m</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">ssl_protocols</span> TLSv1.2 TLSv1.3</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_ecdh_curve</span> x25519:x448:secp521r1:secp384r1:secp256r1</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">ssl_prefer_server_ciphers</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_conf_command</span> Options PrioritizeChaCha</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_ciphers</span> TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256</span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span></code>`),n(q);var M=a(q,10),Ss=s(M);c(Ss,()=>`<code class="language-nginx"><span class="token directive"><span class="token keyword">map</span> <span class="token variable">$http_upgrade</span> <span class="token variable">$connection_upgrade</span></span> <span class="token punctuation">&#123;</span>
    <span class="token directive"><span class="token keyword">default</span> upgrade</span><span class="token punctuation">;</span>
    '' <span class="token directive"><span class="token keyword">close</span></span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span>

<span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">&#123;</span>
     <span class="token directive"><span class="token keyword">listen</span> <span class="token number">13000</span> ssl</span><span class="token punctuation">;</span>      <span class="token comment"># for nginx v1.25.1+</span>
     <span class="token directive"><span class="token keyword">listen</span> [::]:13000 ssl</span><span class="token punctuation">;</span> <span class="token comment"># for nginx v1.25.1+ - keep comment to disable IPv6</span>
     <span class="token directive"><span class="token keyword">http2</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>            <span class="token comment"># uncomment to enable HTTP/2 - supported on nginx v1.25.1+</span>

    <span class="token directive"><span class="token keyword">http3</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>                                 <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">quic_gso</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>                              <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">quic_retry</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>                            <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">add_header</span> Alt-Svc <span class="token string">'h3=":443"; ma=86400'</span></span><span class="token punctuation">;</span> <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>

    <span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">proxy_request_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">client_max_body_size</span> <span class="token number">0</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">client_body_buffer_size</span> <span class="token number">512k</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">http3_stream_buffer_size</span> <span class="token number">512k</span></span><span class="token punctuation">;</span> <span class="token comment"># uncomment to enable HTTP/3 / QUIC - supported on nginx v1.25.0+</span>
    <span class="token directive"><span class="token keyword">proxy_read_timeout</span> <span class="token number">86400s</span></span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">server_name</span> mydomain.com</span><span class="token punctuation">;</span> <span class="token comment"># Change to your domain</span>

    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">&#123;</span>
        <span class="token directive"><span class="token keyword">proxy_pass</span> http://127.0.0.1:12000<span class="token variable">$request_uri</span></span><span class="token punctuation">;</span> <span class="token comment"># Adjust to match APACHE_PORT and APACHE_IP_BINDING. See https://github.com/nextcloud/all-in-one/blob/main/reverse-proxy.md#adapting-the-sample-web-server-configurations-below</span>

        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-Port <span class="token variable">$server_port</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-Scheme <span class="token variable">$scheme</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-Proto <span class="token variable">$scheme</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Early-Data <span class="token variable">$ssl_early_data</span></span><span class="token punctuation">;</span>

        <span class="token comment"># Websocket</span>
        <span class="token directive"><span class="token keyword">proxy_http_version</span> 1.1</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Upgrade <span class="token variable">$http_upgrade</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Connection <span class="token variable">$connection_upgrade</span></span><span class="token punctuation">;</span>
    <span class="token punctuation">&#125;</span>

    <span class="token directive"><span class="token keyword">ssl_certificate</span> /etc/ssl/config/live/mydomain.com/fullchain.pem</span><span class="token punctuation">;</span>   <span class="token comment"># managed by certbot on host machine</span>
    <span class="token directive"><span class="token keyword">ssl_certificate_key</span> /etc/ssl/config/live/mydomain.com/privkey.pem</span><span class="token punctuation">;</span> <span class="token comment"># managed by certbot on host machine</span>

    <span class="token directive"><span class="token keyword">ssl_dhparam</span> /etc/ssl/dhparam</span><span class="token punctuation">;</span> <span class="token comment"># </span>

    <span class="token directive"><span class="token keyword">ssl_early_data</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_session_timeout</span> <span class="token number">1d</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_session_cache</span> shared:SSL:10m</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">ssl_protocols</span> TLSv1.2 TLSv1.3</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_ecdh_curve</span> x25519:x448:secp521r1:secp384r1:secp256r1</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">ssl_prefer_server_ciphers</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_conf_command</span> Options PrioritizeChaCha</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_ciphers</span> TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256</span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span></code>`),n(M);var F=a(M,6),Is=s(F);c(Is,()=>`<code class="language-shell">ufw allow from any to <span class="token operator">&lt;</span>WIREGUARD_IP<span class="token operator">></span> port <span class="token number">13000</span>  <span class="token comment"># Allow vaultwarden on VPN</span>
ufw allow from any to <span class="token operator">&lt;</span>WIREGUARD_IP<span class="token operator">></span> port <span class="token number">443</span>  <span class="token comment"># Enable Nextcloud from VPN only</span>
ufw allow from any to <span class="token operator">&lt;</span>WIREGUARD_IP<span class="token operator">></span> port <span class="token number">8096</span>  <span class="token comment"># Enable Jellyfin from VPN only</span>
ufw allow from any to <span class="token operator">&lt;</span>WIREGUARD_IP<span class="token operator">></span> port <span class="token number">3001</span>  <span class="token comment"># Enable OpenWebUI from VPN only</span>
ufw allow from any to <span class="token operator">&lt;</span>WIREGUARD_IP<span class="token operator">></span> port <span class="token number">9091</span>  <span class="token comment"># Enable Transmission from VPN only</span>
<span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span></code>`),n(F);var X=a(F,22),Ps=s(X);c(Ps,()=>'<code class="language-shell"><span class="token function">apt</span> <span class="token function">install</span> unbound</code>'),n(X);var z=a(X,4),As=s(z);c(As,()=>`<code class="language-yaml"><span class="token key atrule">include-toplevel</span><span class="token punctuation">:</span> <span class="token string">"/etc/unbound/unbound.conf.d/*.conf"</span>
<span class="token key atrule">server</span><span class="token punctuation">:</span>
    <span class="token comment">#logging</span>
    <span class="token comment"># verbosity number, 0 is least verbose. 1 is default.</span>
    <span class="token key atrule">verbosity</span><span class="token punctuation">:</span> <span class="token number">2</span>

    <span class="token comment">#log to stderr</span>
    <span class="token key atrule">use-syslog</span><span class="token punctuation">:</span> no
    <span class="token key atrule">logfile</span><span class="token punctuation">:</span> <span class="token string">""</span>

    <span class="token comment"># print UTC timestamp in ascii to logfile, default is epoch in seconds.</span>
    <span class="token key atrule">log-time-ascii</span><span class="token punctuation">:</span> yes

    <span class="token comment"># print one line with time, IP, name, type, class for every query.</span>
    <span class="token key atrule">log-queries</span><span class="token punctuation">:</span> yes

    <span class="token comment"># log with tag 'query' and 'reply' instead of 'info' for</span>
    <span class="token comment"># filtering log-queries and log-replies from the log.</span>
    <span class="token key atrule">log-tag-queryreply</span><span class="token punctuation">:</span> yes

    <span class="token comment">#binding interface and port</span>
    <span class="token comment"># specify the interfaces and port to answer queries from by ip-address.</span>
    <span class="token key atrule">interface</span><span class="token punctuation">:</span> 0.0.0.0
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5335</span>
    <span class="token comment"># control which clients are allowed to make (recursive) queries</span>
    <span class="token key atrule">access-control</span><span class="token punctuation">:</span> 127.0.0.0/8 allow

    <span class="token comment">#disable IPv6 if not needed</span>
    <span class="token key atrule">do-ip4</span><span class="token punctuation">:</span> yes
    <span class="token key atrule">do-udp</span><span class="token punctuation">:</span> yes
    <span class="token key atrule">do-tcp</span><span class="token punctuation">:</span> yes
    <span class="token key atrule">do-ip6</span><span class="token punctuation">:</span> no

    <span class="token comment">#hardening</span>
    <span class="token comment"># Harden against out of zone rrsets, to avoid spoofing attempts.</span>
    <span class="token key atrule">harden-glue</span><span class="token punctuation">:</span> yes

    <span class="token comment"># Harden against receiving dnssec-stripped data</span>
    <span class="token key atrule">harden-dnssec-stripped</span><span class="token punctuation">:</span> yes

    <span class="token comment"># Use 0x20-encoded random bits in the query to foil spoof attempts.</span>
    <span class="token key atrule">use-caps-for-id</span><span class="token punctuation">:</span> yes

    <span class="token comment"># enable to not answer id.server and hostname.bind queries.</span>
    <span class="token key atrule">hide-identity</span><span class="token punctuation">:</span> yes

    <span class="token comment"># enable to not answer version.server and version.bind queries.</span>
    <span class="token key atrule">hide-version</span><span class="token punctuation">:</span> yes

    <span class="token comment"># Sent minimum amount of information to upstream servers to enhance privacy.</span>
    <span class="token key atrule">qname-minimisation</span><span class="token punctuation">:</span> yes
    
    <span class="token comment"># Aggressive NSEC uses the DNSSEC NSEC chain to synthesize NXDOMAI</span>
    <span class="token key atrule">aggressive-nsec</span><span class="token punctuation">:</span> yes

    <span class="token comment"># If nonzero, unwanted replies are not only reported in statistics,</span>
    <span class="token comment"># but also a running total is kept per thread. If it reaches the</span>
    <span class="token comment"># threshold, a warning is printed and a defensive action is taken,</span>
    <span class="token comment"># the cache is cleared to flush potential poison out of it.</span>
    <span class="token comment"># A suggested value is 10000000, the default is 0 (turned off).</span>
    <span class="token key atrule">unwanted-reply-threshold</span><span class="token punctuation">:</span> <span class="token number">10000000</span>

    <span class="token comment">#efficency</span>
    <span class="token key atrule">prefetch</span><span class="token punctuation">:</span> yes

    <span class="token comment"># Serve expired responses from cache, with serve-expired-reply-ttl in</span>
    <span class="token comment"># the response, and then attempt to fetch the data afresh.</span>
    <span class="token key atrule">serve-expired</span><span class="token punctuation">:</span> yes
    
    <span class="token comment"># Limit serving of expired responses to configured seconds after</span>
    <span class="token comment"># expiration.</span>
    <span class="token key atrule">serve-expired-ttl</span><span class="token punctuation">:</span> <span class="token number">86400</span>

    <span class="token comment"># EDNS reassembly buffer to advertise to UDP peers (the actual buffer</span>
    <span class="token comment"># is set with msg-buffer-size).</span>
    <span class="token key atrule">edns-buffer-size</span><span class="token punctuation">:</span> <span class="token number">1232</span>

    <span class="token comment"># the time to live (TTL) value lower bound, in seconds. Default 0.</span>
    <span class="token comment"># If more than an hour could easily give trouble due to stale data.</span>
    <span class="token key atrule">cache-min-ttl</span><span class="token punctuation">:</span> <span class="token number">3600</span>

    <span class="token comment"># the time to live (TTL) value cap for RRsets and messages in the</span>
    <span class="token comment"># cache. Items are not cached for longer. In seconds.</span>
    <span class="token key atrule">cache-max-ttl</span><span class="token punctuation">:</span> <span class="token number">86400</span>

    <span class="token comment"># the amount of memory to use for the RRset cache.</span>
    <span class="token key atrule">rrset-cache-size</span><span class="token punctuation">:</span> 8m

    <span class="token comment"># the amount of memory to use for the message cache.</span>
    <span class="token key atrule">msg-cache-size</span><span class="token punctuation">:</span> 4m

    <span class="token comment"># number of threads to create. 1 disables threading.</span>
    <span class="token key atrule">num-threads</span><span class="token punctuation">:</span> <span class="token number">4</span>
    
    <span class="token comment"># the number of slabs to use for the RRset cache.</span>
    <span class="token key atrule">rrset-cache-slabs</span><span class="token punctuation">:</span> <span class="token number">4</span>
    
    <span class="token comment"># the number of slabs to use for the message cache.</span>
    <span class="token key atrule">msg-cache-slabs</span><span class="token punctuation">:</span> <span class="token number">4</span></code>`),n(z);var K=a(z,4),Ts=s(K);c(Ts,()=>`<code class="language-shell"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-S</span> <span class="token parameter variable">-L</span> https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh <span class="token operator">|</span> <span class="token function">sh</span> <span class="token parameter variable">-s</span> -- <span class="token parameter variable">-v</span>
/opt/AdGuardHome/AdGuardHome <span class="token parameter variable">-s</span> <span class="token function">install</span>
/opt/AdGuardHome/AdGuardHome <span class="token parameter variable">-s</span> start</code>`),n(K),e(14),l(i,u)},$$slots:{default:!0}}))}const an=Object.freeze(Object.defineProperty({__proto__:null,default:Xs,metadata:B},Symbol.toStringTag,{value:"Module"}));export{an as _,Xs as a};
