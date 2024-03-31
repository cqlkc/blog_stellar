---
title: Caddy -- 一款优秀的Web服务器
cover: ../img/153831.png
description: 用起来比nginx方便太多了...
tags:
  - web
  - caddy
abbrlink: 51203
date: 2023-08-28 14:50:42
---
# 前言

这几天一直在折腾家里的旧手机（参照前文），在用传统的 Nginx 搭建https服务的时候，证书问题真的超级麻烦而且 Nginx 的文件也很复杂，对一些新特性支持也一般，对我这种又懒又想折腾的人及其不友好。

结果在网上冲浪的时候，偶然发现了 Caddy 这个宝藏软件

官网：https://caddyserver.com/docs/

# 独特之处

首先，最重要的是是它的**SSL证书自动申请续期**，过程完全自动而且速度快，自己只需要提供token（或者开放80端口）

其次，它对**新特性的支持优秀**，无需配置便支持 HTTP/3 quic、Markdown自动翻译、ipv6 等特性

![支持http3/quic,ipv6](../img/屏幕截图%202023-08-28%20150439.png)

最后，配置文件简单，配置三个站点仅用短短几行就能解决

~~~Caddyfile
ipv6.pan.cqlkc.top:29565 {
    reverse_proxy / 127.0.0.1:5244
    encode gzip
    tls {
        dns dnspod 	"ID,Token"
    }
}
ipv6.cqlkc.top:443 mirror1.cqlkc.top:23232 {
    root * /home/cqlkc/cqlkc.github.io
    file_server
    encode gzip
    tls {
        dns dnspod 	"ID,Token"
    }
}
~~~

但是，Caddy 相比 Nginx 在性能方面仍有劣势，Nginx 资源占用更低，速度更快（但是它更麻烦啊！

所以小站点可能会更推荐 Caddy，可以大大降低维护成本（利好学生党

# 配置教程

参照[官方文档](https://caddyserver.com/docs/)和我的Caddyfile示例即可

需要注意的是，国内家宽的80端口被封锁，因此 Caddy 默认的 HTTP-01 验证无法正常检验域名所有权

## 非80端口验证域名所有权

解决方法就是用 XCaddy 编译第三方插件和 Caddy 源码第三方插件即可

第三方插件列表在 https://caddyserver.com/docs/modules/ 里面找

我这里有编译过的 DNSpod 插件的 [Caddy 二进制文件（ARM64）](https://pan.cqlkc.top:29565/d/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98/Caddy/caddy)，可以直接用

# 总结

Caddy 很好用很好用很好用，懒人必备（笑




