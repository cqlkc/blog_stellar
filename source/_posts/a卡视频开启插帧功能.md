---
title: a卡视频开启插帧功能
categories: 水文
description: A卡特有的插帧功能
cover: ./img/posts/屏幕截图 2022-12-15 161100.webp
tags: 插帧
abbrlink: 59508
swiper_index: 1
date: 2022-12-15 15:56:51
---

# 写在开头

月考结束后又是快乐的网课时光，所以决定水一篇文章证明我还活着（大雾

我们知道一般的视频帧率大多约为24fps，而通过 **Bluesky Frame Rate Converter 视频滤镜**我们可以将24fps补全至60fps ( 甚至更高 ) 以**增加视频流畅度**

当然，这个有硬件限制，那就是必须是GCN架构的AMD GPU

2024更：RDNA架构也可用

---

# 准备

- **GCN架构的GPU（当然要装驱动**
- [Potplayer播放器](https://potplayer.daum.net/)
- [Bluesky Frame Rate Converter 视频滤镜](https://bluesky-soft.com/en/BlueskyFRC.html)

## 如何判断我的GPU是不是GCN架构？

一般来说，AMD的独立显卡系列从HD 7000系列开始 ~~(不会还有人在用这么老的显卡吧~~，一直到RX 500系列都是用的GCN架构

核心显卡应该是笔记本系列**锐龙5000系及其以前**的几乎所有型号，台式机系列**除锐龙7000系**所有型号也都是GCN架构

# 配置

在准备并安装好上述软件后，就可以开始我们的配置工作了

## Bluesky FRC配置

首先，打开刚刚安装的Bluesky FRC

按照如图进行配置即可，部分配置可以自己微调

比如:

- Output的输出帧率可以根据自身设备情况调，我的显示器是75Hz所以调到了72p，如果是60Hz的用60p即可

![](https://img.cqlkc.top/202212/eb379e85b24f6148bb73285e71cd272c.webp)

## AMD驱动配置

首先，桌面找个空白处右键，选择**AMD Software: Adrenalin Edition**

![](https://img.cqlkc.top/202212/f60859fd6676575e22d705d0b1992eb7.webp)

打开后，直接在右上角搜索框，输入："**音频和视频设置**"

在**视频配置文件**一项中，选择自定义，然后会出现一个"**自定义选项**"

找到**AMD Fluid Motion Video**并开启即可

![](https://img.cqlkc.top/202212/6c6a8604e5b5c9c32560e6264ca423b8.webp)

## Potplayer 配置

随便打开一个视频，右键找到"**选项**"

左侧侧边栏选择**滤镜--全局滤镜优先权**

右侧点击**添加系统滤镜**，找到"**Bluesky Frame Rate Converter**"并添加

然后，别忘了优先顺序选择为"**强制使用**"

![](https://img.cqlkc.top/202212/0f72daacb097fecd29fea4ec4055a764.webp)

# 效果展示

至此，所有配置工作都结束了，来看一下效果如何

![](https://img.cqlkc.top/202212/57454b26023c196664bfa8810d17be47.webp)

可以看到帧率显示“23.976 -> 71.92”，这就代表插帧成功了

当然这种即时插帧效果比较一般，而且像动漫这些还是得24fps看起来才对味

# 深度折腾

以上配置都是基于Potplayer进行的，这个播放器很有意思，可以搭配madVR+LAV实现一些很惊艳的视频显示效果

（当然我这种用着廉价显示器的，看着低码率资源的菜鸡就不用折腾就是了``
