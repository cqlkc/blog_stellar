const CACHE_NAME = 'ICDNCache';
let cachelist = [];
self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();
    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(cachelist);
            })
    );
});
self.addEventListener('fetch', async event => {
    try {
        event.respondWith(handle(event.request))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});
const handleerr = async (req, msg) => {
    return new Response(`<h1>sw挂了</h1>
    <b>${msg}</b>`, { headers: { "content-type": "text/html; charset=utf-8" } })
}
let cdn = {//镜像列表
    "gh": {
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/gh"
        },
        tianli: {
            "url": "https://cdn1.tianli0.top/gh"
        }
    },
    "combine": {
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/combine"
        },
        jsdelivr_fastly: {
            "url": "https://fastly.jsdelivr.net/combine"
        }
    },
    "npm": {
        afdelivr: {
            "url": "https://cdn.afdelivr.top/npm"
        },
        eleme: {
            "url": "https://npm.elemecdn.com"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/npm"
        },
        jsdelivr_fastly: {
            "url": "https://fastly.jsdelivr.net/npm"
        },
        zhimg: {
            "url": "https://unpkg.zhimg.com"
        },
        unpkg: {
            "url": "https://unpkg.com"
        },
        tianli: {
            "url": "https://cdn1.tianli0.top/npm"
        }
    }
}
//主控函数
const handle = async function (req) {
    const urlStr = req.url
    const domain = (urlStr.split('/'))[2]
    const urlObj = new URL(urlStr);
    const urlPath = urlObj.pathname;
    const pathname = urlObj.href.substr(urlObj.origin.length);
    let urls = []
    if (pathname.match(/\/sw\.js/g)) { return fetch(req) }
    if(domain === "cqlkc.top"){
        return lfetch(generate_blog_urls('cqlkc-mirror',await db.read('blog_version') || '1.0.1',fullpath(urlPath)))
        .then(res=>res.arrayBuffer())//arrayBuffer最科学也是最快的返回
        .then(buffer=>new Response(buffer,{headers:{"Content-Type":"text/html;charset=utf-8"}}))//重新定义header
    }
    for (let i in cdn) {
        for (let j in cdn[i]) {
            if (domain == cdn[i][j].url.split('https://')[1].split('/')[0] && urlStr.match(cdn[i][j].url)) {
                urls = []
                for (let k in cdn[i]) {
                    urls.push(urlStr.replace(cdn[i][j].url, cdn[i][k].url))
                }
                if (urlStr.indexOf('@latest/') > -1) {
                    return lfetch(urls, urlStr)
                } else {
                    return caches.match(req).then(function (resp) {
                        return resp || lfetch(urls, urlStr).then(function (res) {
                            return caches.open(CACHE_NAME).then(function (cache) {
                                cache.put(req, res.clone());
                                return res;
                            });
                        });
                    })
                }
            }
        }
    }
    return fetch(req)
}
const lfetch = async (urls, url) => {
    let controller = new AbortController();
    const PauseProgress = async (res) => {
        return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
    };
    if (!Promise.any) {
        Promise.any = function (promises) {
            return new Promise((resolve, reject) => {
                promises = Array.isArray(promises) ? promises : []
                let len = promises.length
                let errs = []
                if (len === 0) return reject(new AggregateError('All promises were rejected'))
                promises.forEach((promise) => {
                    promise.then(value => {
                        resolve(value)
                    }, err => {
                        len--
                        errs.push(err)
                        if (len === 0) {
                            reject(new AggregateError(errs))
                        }
                    })
                })
            })
        }
    }
    return Promise.any(urls.map(urls => {
        return new Promise((resolve, reject) => {
            fetch(urls, {
                signal: controller.signal
            })
                .then(PauseProgress)
                .then(res => {
                    if (res.status == 200) {
                        controller.abort();
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
        })
    }))
}
/*
2022-11-30新增all-site-npm
*/
const fullpath = (path) => {
    path = path.split('?')[0].split('#')[0]
    if (path.match(/\/$/)) {
        path += 'index'
    }
    if (!path.match(/\.[a-zA-Z]+$/)) {
        path += '.html'
    }
    return path
}
const generate_blog_urls = (packagename, blogversion, path) => {
    const npmmirror = [
        `https://cdn.afdelivr.top/npm/${packagename}@${blogversion}`,
        `https://unpkg.com/${packagename}@${blogversion}`,
        `https://npm.elemecdn.com/${packagename}@${blogversion}`,
        `https://cdn.jsdelivr.net/npm/${packagename}@${blogversion}`,
        `https://npm.sourcegcdn.com/npm/${packagename}@${blogversion}`,
        `https://cdn1.tianli0.top/npm/${packagename}@${blogversion}`
    ]
    for (var i in npmmirror) {
        npmmirror[i] += path
    }
    return npmmirror
}
const mirror = [
    `https://registry.npmmirror.com/cqlkc-mirror/latest`,
    `https://registry.npmjs.org/cqlkc-mirror/latest`,
    `https://mirrors.cloud.tencent.com/npm/cqlkc-mirror/latest`
]
const get_newest_version = async (mirror) => {
return lfetch(mirror, mirror[0])
    .then(res => res.json())
    .then(res.version)
}
self.db = { //全局定义db,只要read和write,看不懂可以略过
    read: (key, config) => {
        if (!config) { config = { type: "text" } }
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(cache => {
                cache.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                    if (!res) resolve(null)
                    res.text().then(text => resolve(text))
                }).catch(() => {
                    resolve(null)
                })
            })
        })
    },
    write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
}

const set_newest_version = async (mirror) => { //改为最新版本写入数据库
    return lfetch(mirror, mirror[0])
        .then(res => res.json()) //JSON Parse
        .then(async res => {
            await db.write('blog_version', res.version) //写入
            return;
        })
}

setInterval(async() => {
    await set_newest_version(mirror) //定时更新,一分钟一次
}, 60*1000);

setTimeout(async() => { 
    await set_newest_version(mirror)//打开五秒后更新,避免堵塞
},5000)