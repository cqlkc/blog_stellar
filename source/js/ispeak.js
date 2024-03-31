function pia(){
    var head = document.getElementsByTagName('head')[0]
    var meta = document.createElement('meta')
    meta.name = 'referrer'
    meta.content = 'no-referrer'
    head.appendChild(meta)
    if (ispeak) {
        ispeak
        .init({
            el: '#ispeak',
            api: 'https://kkapi.cqlkc.top/',
            author: '633aaa45d0d52c818b1cf9c1',
            pageSize: 10,
            loading_img: 'https://bu.dusays.com/2022/05/01/626e88f349943.gif',
            comment: 
            function (speak) {
            // 4.4.0 之后在此回调函数中初始化评论
            const { _id, title, content } = speak
            const contentSub = content.substring(0, 30)
            twikoo.init({
                envId: 'https://vercel.cqlkc.top', // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
                pageTitle: title || contentSub, // 手动传入当前speak的标题(由于content可能过长，因此截取前30个字符)
                site: 'bbtalk',
                el: '.ispeak-comment', // 容器元素
                // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
                path:  '/bbtalk/info.html?q=' + _id, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数'/bbtalk/info.html?q=' +
                // lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/main/src/client/utils/i18n/index.js
                onCommentLoaded: function () {
                
            }
            })
            }
        })
        .then(function () {
            console.log('ispeak 加载完成')
            document.getElementById('tip').style.display = 'none'
        })
    } else {
        document.getElementById('tip').innerHTML = 'ipseak依赖加载失败！'
    }
}
pia();
document.addEventListener('pjax:complete', () => {
    pia();
})
