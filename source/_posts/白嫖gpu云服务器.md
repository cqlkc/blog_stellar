---
title: '白嫖gpu云服务器部署webui方案汇总'
description: 白嫖才是第一生产力（（
categories: 水文
tags:
  - 白嫖
  - GPU云服务器
cover: ./../img/00016-2381107994.png
abbrlink: 39808
date: 2022-11-23 22:26:40
swiper_index: 1
---
# Paperspace方案（不推荐）

官网：

https://www.paperspace.com/

这里是自己写的终端命令全流程，直接CV到终端回车即可

用的anythingv3.0的3.7g模型，也可以用别的，自己改，但不能超过4.5g（数据瞎估的，反正太大存不下

```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui/
mkdir -p /notebooks/stable-diffusion-webui/models/Stable-diffusion /notebooks/stable-diffusion-webui/models/hypernetworks
wget  -P /notebooks/stable-diffusion-webui/models/Stable-diffusion/  "https://huggingface.co/Linaqruf/anything-v3.0/resolve/main/Anything-V3.0-pruned.ckpt"
COMMANDLINE_ARGS="--exit" REQS_FILE="requirements.txt" python launch.py
python lauch.py --share
```
最后一步的"INFO bore_cli::client: listening at bore.pub:xxxxx"中的pore.pub:xxxxx就是生成的隧道链接，直接打开即可

只能连续用6h用完了重启即可，没有限额

# Google Colab方案（不可用）

# Kaggle（推荐）

官网：https://www.kaggle.com

直接创建一个空白的notebook即可

记得验证手机号以启用GPU（推荐使用T4*2并使用半精度）和 Internet 链接


```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui/
mkdir -p /kaggle/working/stable-diffusion-webui/models/Stable-diffusion /notebooks/stable-diffusion-webui/models/hypernetworks
wget  -P /kaggle/working/stable-diffusion-webui/models/Stable-diffusion/  "https://huggingface.co/gsdf/Counterfeit-V3.0/resolve/main/Counterfeit-V3.0_fp16.safetensors"
COMMANDLINE_ARGS="--exit" REQS_FILE="requirements.txt" python launch.py
python lauch.py --share
```
注：模型用的是Counterfeit-V3.0_fp16，感觉还不错
![2381107994](./../img/00016-2381107994.png)