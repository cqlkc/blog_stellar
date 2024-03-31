---
title: A卡、I卡如何愉快地使用UVR5
description: 要玩AI就别买A卡
tags:
  - 水文
abbrlink: 37966
date: 2023-05-27 09:34:58
---

# DirectML 分支解决方案

UVR5项目在GitHub有人为它做了DirectML分支，能够在支持DX12的GPU上启用GPU加速

项目链接：[Aloereed/ultimatevocalremovergui-directml](https://github.com/Aloereed/ultimatevocalremovergui-directml)

但是该分支目前**仅支持VR Architecture算法**

1. git clone https://github.com/Aloereed/ultimatevocalremovergui-directml.git

2. pip install -r requirements.txt

3. 将已下载的模型拖入model文件夹（或者在GUI中下载）

4. python UVR.py

   

# ROCM 解决方案

注意：此方案仅支持A卡，要求Linux环境（推荐Ubuntu20.04）

首先，安装显卡驱动和ROCM

可以通过其他人制作的一键工具，或者根据他人教程安装

[AMD显卡 Ubuntu 部署Stable DIffusion WebUI基于Pytorch2.0.0 Rocm5.4.2_Ha7nk的博客-CSDN博客](https://blog.csdn.net/u011450629/article/details/129793402)

不过这个教程直接用的自带的python3进行安装（**不推荐**）

建议使用conda创建一个虚拟环境进行安装

[k7212519/ksd-launcher: AMD专用stable-diffusion-webui 图形化安装启动器 KSD-Launcher (github.com)](https://github.com/k7212519/ksd-launcher)

这个执行到安装完成驱动就行，实测可用

首先下载https://github.com/Anjok07/ultimatevocalremovergui/archive/refs/heads/master.zip

```bash
sudo apt update && sudo apt upgrade
sudo apt-get update
sudo apt install ffmpeg
sudo apt install python3-pip
sudo apt-get -y install python3-tk
pip3 install -r requirements.txt
```



