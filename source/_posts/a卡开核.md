---
title: 给你的A卡换张皮--强刷vBIOS开核
description: 开核是A卡的优秀传统，不能丢doge
categories: 水文
tags:
  - 电脑
  - 显卡
abbrlink: 59890
date: 2022-11-21 21:48:30
swiper_index: 1
cover: "https://img.cqlkc.top/202212/cdbd0cb24a4c2126ae7fea631d1405b6.webp"
---

# 写在开头

开核，一个AMD的产品特有的词汇。

对于CPU而言，在Zen架构之前的系列里，部分特定批次的CPU可以在主板BIOS中打开那些被AMD屏蔽掉的可用核心（都是稀缺货

对于GPU而言，同样也是打开AMD屏蔽掉的那些流处理器，不过显卡不能通过像CPU那样调节BIOS轻松实现，但是它一般具有普适性

即只要是这个核心的显卡，就能通过强刷vBIOS来打开被屏蔽的流处理器

（有时为了让黑苹果免驱（如RX580 2048SP刷RX570），为了变身专业卡（Vega56刷WX8200）等，我们也许也会称这种行为叫开核，但这并不是严格意义上的开核，这顶多算换了个皮

# 实践前提

## 确认条件

首先，你先要有一块能够开核（或者开核有实际意义的）显卡

一般来说，有如下常见型号:（箭头具有传递性，也可以反着刷，只要你愿意XD）

1. RX470D[^1]-->RX470-->RX580 2048SP

2. RX460 --> RX560

3. RX560d[^1] --> RX560

4. RX480 --> RX580 --> RX590GME

5. RX Vega56 --> RX Vega64

[^1]:"可以产生额外的流处理器"



## 准备vBIOS
刷VBIOS具有极高的风险，要随时做好刷黑变砖的准备!

1.第一步打开[GPU-Z ](https://www.techpowerup.com/download/techpowerup-gpu-z/)"（如果没有，曾经作为一名图钉，我推荐[图吧工具箱](http://www.tbtool.cn/)，doge）

如果没有问题的话，你应该看到这个界面

![GPU-Z](https://img.cqlkc.top/202212/cdbd0cb24a4c2126ae7fea631d1405b6.webp)

这是对你现在使用的VBIOS的备份，非常重要！！

2.点击如图标出的小箭头，选择一个你可以找到的地方保存下来

（同时记住标红的几个参数，图中“4096MB”处对应你的显存大小，“Hynix”对于你的显存品牌

3.接下来，进入[VGA Bios Collection | TechPowerUp](https://www.techpowerup.com/vgabios/)检索适合你的显卡的VBIOS

这里简单说下选择VBIOS的原则：

1. 核心一样（RX480 4G-->RX580 4G是允许的，RX460 --> RX580是不被允许的）
2. 显存容量，品牌一样（RX480 4G尔必达 --> RX480 4G三星不被允许，RX480 4G海力士 --> RX580 4G海力士 是允许的）

如图就是RX480 4G（海力士）对应的一个比较好的VBIOS（高亮的地方均符合要求

![](https://img.cqlkc.top/202212/0c0f91c8b63cabf819cb2264bfdb2699.jpg)

---



# 刷入vBIOS

1. 到[AMDVBFlash / ATI ATIFlash (3.31) Download | TechPowerUp](https://www.techpowerup.com/download/ati-atiflash/)下载软件 AMDVBFlash 并解压至一个你找得到的地方

2. 将提前准备的待刷入的vBIOS，与amdvbflash放置在同一文件夹

3. 右键，选择“在此处打开命令窗口”，输入

   amdvbflash.exe -p -f 0 xxx.rom

   其中，xxx.rom为准备的vBIOS

4. 如果一切正常，他应该会提示你“Restart System To Complete VBIOS Update.”

   ![](https://i0.hdslb.com/bfs/album/c66ffba0beca04d8bc6d2816544a0ad3c8246cbc.jpg)

5. 重启电脑后，打开GPU-Z看看效果如何

   如图，是我用RX480 4G刷的RX580 4G的成品图

![变身RX580](https://img.cqlkc.top/202212/851b780760bcef4a1530a2ac2088c32f.webp)

# 刷黑救砖

刷vBIOS是一件有极大风险的事（失败了显卡直接变砖

不过一般而言，仅是刷错了vBIOS的话，显卡都还能救回来

## 对于有双vBIOS开关的卡

有双vBIOS开关的卡救卡难度是最低的

如果你发现刷入vBIOS后开机不过自检/黑屏，断电关机，切换vBIOS开关重启

进入系统后，直接切换vBIOS开关，依照[刷入vBIOS](#刷入vBIOS)的方法再次强刷回先前备份的原vBIOS

（因此说备份vBIOS很重要！）

## 对于没双vBIOS开关的

可以在DOS环境下盲刷，具体教程：

https://tieba.baidu.com/p/5500803523

可以在PE（Windows）环境下盲刷，对电脑要有相当的熟悉才可以做到：

https://tieba.baidu.com/p/6728462628

还有一种要用到编程器，这里就不涉及了（我没有也不会

# 最后

刷vBIOS有意思归有意思，但他最后有没有用嘛，就是另一回事了

如我的RX480 4G刷上RX580 4G后

待机功耗52W --> 90W

游戏功耗 90Ww --> 148W

功耗增加了50%以上，然而性能反而下降了10%左右

因为虽然RX480 和RX580本质上没什么区别，都是魔改GCN北极星架构

但是RX480供电为8pin TDP约120W，而RX580为8+6pin TDP约180W

刷入RX580的vBIOS后，针对RX480设计的供电和散热纷纷撞墙，因此性能不增反减

不过也不失为一种打发时间的好方法doge