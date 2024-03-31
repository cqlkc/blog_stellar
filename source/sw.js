const CACHE_NAME = 'cqlkc-sw';
let cachelist = [];
self.cons = {
    s: (m) => {
        console.log(`%c[SUCCESS]%c ${m}`, 'color:white;background:green;', '')
    },
    w: (m) => {
        console.log(`%c[WARNING]%c ${m}`, 'color:brown;background:yellow;', '')
    },
    i: (m) => {
        console.log(`%c[INFO]%c ${m}`, 'color:white;background:blue;', '')
    },
    e: (m) => {
        console.log(`%c[ERROR]%c ${m}`, 'color:white;background:red;', '')
    },
    d: (m) => {
        console.log(`%c[DEBUG]%c ${m}`, 'color:white;background:black;', '')
    }
}
const generate_uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
self.db = {
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

self.addEventListener('activate', async function (installEvent) {
    self.clients.claim()
})

self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();

    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(async function (cache) {
                if (!await db.read('uuid')) {
                    await db.write('uuid', generate_uuid())
                }
                return cache.addAll(cachelist);
            })
    );
});
const handleerr = async (req, msg) => {
    return new Response(`<h1>sw挂了</h1>
    <b>${msg}</b>`, { headers: { "content-type": "text/html; charset=utf-8" } })
}

let cdn = {
    "gh": {
        zzko: {
            "url": "https://jsd.cdn.zzko.cn/gh"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/gh"
        }
    },
    "npm": {
        eleme: {
            "url": "https://npm.elemecdn.com"
        },
        zzko: {
            "url": "https://jsd.cdn.zzko.cn/npm"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/npm"

        }
        //oplog: {
        //    "url": "https://cdn.oplog.cn/npm"
        //},
        

    }
}

const cache_url_list = []
const blog_default_version = '2.0.0'
const handle = async function (req) {
    set_blog_config(await db.read('blog_version') || blog_default_version)
    const reqdata = await req.clone()
    // try {
    //     if (!wsc.OPEN) wsc.onclose()
    // } catch (e) { }
    const urlStr = req.url
    let urlObj = new URL(urlStr)
    const uuid = await db.read('uuid')
    const pathname = urlObj.href.substr(urlObj.origin.length)
    const port = urlObj.port
    const domain = (urlStr.split('/'))[2]
    if (pathname.match(/\/sw\.js/g)) { return fetch(req) }
    if (pathname.match(/\/null/g)) { return null }
    if (pathname.match(/\/undefined/g)) { return null }
    const path = pathname.split('?')[0]
    const query = q => urlObj.searchParams.get(q)
    let urls = []
    let msg = JSON.parse(await db.read('msg')) || (async () => { await db.write('msg', '[]'); return '[]' })()
    const nqurl = urlStr.split('?')[0]
    const nqreq = new Request(nqurl)
    const cache_delete = async (url) => {
        const cache = await caches.open(CACHE_NAME)
        await cache.delete(url)
    }

    if (query('nosw') == 'true') {
        return fetch(req)
    }
    if (query('delete') == 'true') {

        cache_delete(nqreq);
        msg.push(
            {
                "name": "文件已删除",
                "time": new Date(),
                "info": `已删除${nqurl}`
            }
        )
        await db.write('msg', JSON.stringify(msg))
        return new Response(JSON.stringify({ ok: 1 }))
    }
    if (query('forceupdate') == 'true') {
        //update cache

        msg.push(
            {
                "name": "文件已强制更新",
                "time": new Date(),
                "info": `已更新${nqurl}`
            }
        )
        await db.write('msg', JSON.stringify(msg))
        await fetch(req).then(function (res) {
            return caches.open(CACHE_NAME).then(function (cache) {
                cache_delete(nqreq);
                cache.put(req, res.clone());
                return res;
            });
        });
        return new Response(JSON.stringify({ ok: 1 }))
    }
    for (let i in cdn) {
        for (let j in cdn[i]) {

            if (domain == cdn[i][j].url.split('https://')[1].split('/')[0] && urlStr.match(cdn[i][j].url)) {
                urls = []
                for (let k in cdn[i]) {
                    urls.push(urlStr.replace(cdn[i][j].url, cdn[i][k].url))
                }
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
    for (var i in blog.origin) {
        if (domain.split(":")[0] == blog.origin[i].split(":")[0]) {
            // if (typeof wsc !== "undefined") {
            //     if (wsc.readyState != 1) {
            //         await db.write('disconnect', '1')
            //     } else {
            //         await db.write('disconnect', '0')
            //     }
            // }
            if (blog.local) { return fetch(req) }
            setTimeout(async () => {
                await set_newest_blogver()
            }, 30 * 1000);
            urls = []
            for (let k in blog.plus) {
                //urls.push(urlStr.replace(domain, blog.plus[k]).replace(domain + ":" + port, blog.plus[k]).replace('http://', "https://"))
                urls.push(`https://${blog.plus[k]}` + fullpath(pathname))
            }
            for (let k in blog.npmmirror) {
                urls.push(blog.npmmirror[k] + fullpath(pathname))
            }
            const generate_blog_html = async (res) => {
                return new Response(await res.arrayBuffer(), {
                    headers: {
                        'Content-Type': 'text/html;charset=utf-8'
                    },
                    status: res.status,
                    statusText: res.statusText
                })
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    caches.match(req).then(function (resp) {
                        if (!!resp) {
                            cons.s(`Cache Hited! | Origin:${urlStr}`)
                            setTimeout(() => {
                                resolve(resp)
                            }, 200);
                            setTimeout(() => {
                                lfetch(urls, urlStr).then(async function (res) {
                                    return caches.open(CACHE_NAME).then(async function (cache) {
                                        cache.delete(req);
                                        cons.s(`Cache Updated! | Origin:${urlStr}`)
                                        if (fullpath(pathname).match(/\.html$/g)) {
                                            const NewRes = await generate_blog_html(res)
                                            cache.put(req, NewRes.clone());
                                            resolve(NewRes)
                                        } else {
                                            cache.put(req, res.clone());
                                            resolve(res)
                                        }
                                    });
                                });
                            }, 0);
                        } else {
                            cons.w(`Cache Missed! | Origin:${urlStr}`)
                            setTimeout(() => {
                                lfetch(urls, urlStr).then(async function (res) {
                                    return caches.open(CACHE_NAME).then(async function (cache) {
                                        if (fullpath(pathname).match(/\.html$/g)) {
                                            const NewRes = await generate_blog_html(res)
                                            cache.put(req, NewRes.clone());
                                            resolve(NewRes)
                                        } else {
                                            cache.put(req, res.clone());
                                            resolve(res)
                                        }
                                    });
                                }).catch(function (err) {
                                    resolve(caches.match(new Request('/offline.html')))
                                })
                            }, 0);
                            setTimeout(() => {
                                resolve(caches.match(new Request('/offline.html')))
                            }, 5000);
                        }
                    })
                }, 0);
            })

        }
    }
    for (var i in cache_url_list) {
        if (urlStr.match(cache_url_list[i])) {
            return caches.match(req).then(function (resp) {
                return resp || fetch(req).then(function (res) {
                    return caches.open(CACHE_NAME).then(function (cache) {

                        cache.put(req, res.clone());
                        return res;
                    });
                });
            })
        }
    }

    return fetch(req)
}

const lfetch = async (urls, url) => {
    cons.i(`LFetch Handled! | Mirrors Count:${urls.length} | Origin: ${url}`)
    const t1 = new Date().getTime()
    const uuid = await db.read('uuid')
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
    let controller = new AbortController();
    const PauseProgress = async (res) => {
        return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
    };
    let results = Promise.any(urls.map(async urls => {
        return new Promise(async (resolve, reject) => {
            fetch(urls, {
                signal: controller.signal
            })
                .then(PauseProgress)
                .then(async res => {
                    const resn = res.clone()
                    if (resn.status == 200) {
                        controller.abort();
                        cons.s(`LFetch Success! | Time: ${new Date().getTime() - t1}ms | Origin: ${url} `)
                        resolve(resn)
                    } else {
                        reject(null)
                    }
                }).catch((e) => {
                    if (String(e).match('The user aborted a request') || String(e).match('Failed to fetch')) {
                        console.log()
                    } else if (String(e).match('been blocked by CORS policy')) {
                        cons.e(`LFetch Blocked by CORS policy! | Origin: ${url}`)
                    }
                    else {
                        cons.e(`LFetch Error! | Origin: ${url} | Resean: ${e}`)
                    }
                    reject(null)
                })
        }
        )
    }
    )).then(res => { return res }).catch(() => { return null })

    return results

}

const fullpath = (path) => {
    path = path.split('?')[0].split('#')[0]
    if (path.match(/\/$/)) {
        path += 'index'
    }
    if (!path.match(/\.[a-zA-Z0-9]+$/)) {
        path += '.html'
    }
    return path
}



const set_blog_config = (version) => {
    self.packagename = "cqlkc-mirror"
    self.blogversion = version
    self.blog = {
        local: 0,
        origin: [
            "cqlkc.top",
        ],
        plus: [
            //"cqlkc.top",
            //"tkserver.cqlkc.top:47819",
            "cqlkc.4everland.app",
            "vc.cqlkc.top",
        ],

        npmmirror: [
            //`https://cdn1.tianli0.top/npm/${packagename}@${blogversion}`,
            `https://jsd.cdn.zzko.cn/npm/${packagename}@${blogversion}`,
           //`https://cdn.afdelivr.top/npm/${packagename}@${blogversion}`,
            //`https://npm.elemecdn.com/${packagename}@${blogversion}`,
            //`https://unpkg.com/${packagename}@${blogversion}`,
            //`https://cdn.jsdelivr.net/npm/${packagename}@${blogversion}`,
            //`https://cdn-jsd.pigax.cn/npm/${packagename}@${blogversion}`,
            //`https://cdn.oplog.cn/npm/${packagename}@${blogversion}/public`
        ]
    };
}
const set_newest_blogver = async () => {
    self.packagename = "cqlkc-mirror"
    const mirror = [
        `https://registry.npmmirror.com/${packagename}/latest`,
        `https://registry.npmjs.org/${packagename}/latest`,
        `https://mirrors.cloud.tencent.com/npm/${packagename}/latest`
    ]
    cons.i(`Searching For The Newest Version...`)
    return lfetch(mirror, mirror[0])
        .then(res => res.json())
        .then(async res => {
            if (!res.version) throw ('No Version Found!')
            const gVer = choose_the_newest_version(res.version, await db.read('blog_version') || blog_default_version)
            cons.d(`Newest Version: ${res.version} ; Local Version: ${await db.read('blog_version')} | Update answer: ${gVer}`)
            cons.s(`Update Blog Version To ${gVer}`);
            if (gVer !== await db.read('blog_version') && gVer !== blog_default_version){
                function a() {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
                a();
            }
            await db.write('blog_version', gVer)
            set_blog_config(gVer)
        })
        .catch(e => {
            cons.e(`Get Blog Newest Version Erorr!Reseon:${e}`);
            set_blog_config(blog_default_version)
        })
}


const choose_the_newest_version = (g1, g2) => {

    const spliter = (v) => {

        const fpart = v.split('.')[0]
        return [parseInt(fpart), v.replace(fpart + '.', '')]
    }
    const compare_npmversion = (v1, v2) => {
        const [n1, s1] = spliter(v1)
        const [n2, s2] = spliter(v2)
        cons.d(`n1:${n1} s1:${s1} n2:${n2} s2:${s2}`)
        if (n1 > n2) {
            return g1
        } else if (n1 < n2) {
            return g2
        } else if (!s1.match(/\./) && !s2.match(/\./)) {
            if (parseInt(s1) > parseInt(s2)) return g1
            else return g2
        } else {
            return compare_npmversion(s1, s2)
        }
    }
    return compare_npmversion(g1, g2)
}

setInterval(async () => {
    cons.i('Trying to fetch the newest version...')
    await set_newest_blogver()
}, 120 * 1000);
setTimeout(async () => {
    await set_newest_blogver()
}, 1000);



self.addEventListener('fetch', async event => {
    try {

        event.respondWith(handle(event.request))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});

