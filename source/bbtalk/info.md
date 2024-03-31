---
title: Speak
date: 2022-08-21 14:11:00
update: 2022-08-21 14:11:00
aside: false
comments: false
#description: 
---

<!-- CSS -->
<!--<link href="https://unpkg.com/artalk@2.3.4/dist/Artalk.css" rel="stylesheet">-->
<link
  rel="stylesheet"
  href="https://jsd.onmicrosoft.cn/npm/ispeak@4.4.0/style.css"
/>
<link rel="stylesheet" href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/atom-one-dark.min.css" />
<div class='content'>
</div>
<hr />
<div class='ispeak-comment'></div>
<!-- JS -->
<script src="https://cdn.staticfile.org/highlight.js/10.6.0/highlight.min.js"></script>
<script src="https://cdn.staticfile.org/marked/2.0.0/marked.min.js"></script>
<script src="https://jsd.onmicrosoft.cn/npm/ispeak@4.4.0/ispeak.umd.js"></script>
<div id="tcomment"></div>
<script src="https://jsd.onmicrosoft.cn/npm/twikoo@1.6.7/dist/twikoo.all.min.js"></script>
<script>
  const searchParams = new URLSearchParams(window.location.search);
  const speakId = searchParams.get('q');
  const path = window.location.pathname;
  const apiURL = 'https://kkapi.cqlkc.top/api/ispeak';
  const markedRender = (body, loading_img='https://bu.dusays.com/2022/05/01/626e88f349943.gif') => {
    const renderer = {
      image(href, title, text) {
        return `<a href="${href}" target="_blank" data-fancybox="group" class="fancybox">
            <img speak-src="${href}" src=${loading_img} alt='${text}'>
            </a>`
      }
    }
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function (code) {
        if (hljs) {
          return hljs.highlightAuto(code).value
        } else {
          return code
        }
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    })
    marked.use({ renderer })
    return marked.parse(body)
  }
  fetch(`${apiURL}/get/${speakId}`)
  .then(response => response.json())
  .then(res => {
    const data = res.data;
    if(data){
      const {title,content} = data;
      const contentSub = content.substring(0, 30);
      document.querySelector('.content').innerHTML = markedRender(content);
      if(title){
        document.title = title;
      }
      twikoo.init({
        envId: 'https://vercel.cqlkc.top', // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
        pageTitle: title || contentSub, // 手动传入当前speak的标题(由于content可能过长，因此截取前30个字符)
        site: 'bbtalk',
        el: '.ispeak-comment', // 容器元素
        // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
        path:  '/bbtalk/info.html?q=' + _id, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数'/bbtalk/info.html?q=' +
         // lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/main/src/client/utils/i18n/index.js
          })
    }
  });
  
</script>
