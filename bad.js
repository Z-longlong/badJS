/**
 * host 上传域名地址
 * clienttype 客户端类型 0 后台系统
 */
window.badJS = function({
    host,
    clienttype
}) {
    const PARAMS_MAX_LENGTH = {
        IE: 2083,
        Firefox: 65536,
        Safari: 80000,
        chrome: 8182
    };
    // type 1 vue error  2 promise error 3 static error  4 jserror
    window.onload = function() {
        let vue = window.globalVue;
        if (vue) {
            // vue error
            vue.constructor.config.errorHandler = function(error, vm, info) {
                let str =
                    'errorType=' +
                    error.name +
                    '&msg=' +
                    error.message +
                    '&userBehavior=' +
                    info +
                    // encodeURIComponent 防止被截断 URL中含有# 后面会被截断
                    '&from=' +
                    encodeURIComponent(location.href) +
                    "&type=1&clienttype=" +
                    clienttype +
                    '&errorTime=' +
                    new Date().getTime();
                if (!strlen(str)) {
                    throw new Error('Exceeded the browser limit parameter length');
                }
                new Image().src = host + '/badjs/error?' + str;
            };
            // vue warn 生产环境不报错 vue.constructor.config.warnHandler
        }
    };
    // 监听 promise 错误
    window.addEventListener(
        'unhandledrejection',
        (err) => {
            err.preventDefault();
            let str =
                'errorType=Promise error' + '&msg=' + err.reason ?
                err.reason :
                '未传入错误信息' +
                '&from=' +
                encodeURIComponent(location.href) +
                '&type=2&clienttype=' +
                clienttype +
                '&errorTime=' +
                new Date().getTime();
            if (!strlen(str)) {
                throw new Error('Exceeded the browser limit parameter length');
            }
            new Image().src = host + '/badjs/error?' + str;
        },
        false
    );
    // 监听js 错误
    window.onerror = function(msg, url, line, col, error) {
        // 异步防止阻塞
        setTimeout(function() {
            let defaults = {};
            col = col || (window.event && window.event.errorCharacter) || 0;
            defaults.filePath = url;
            defaults.line = line;
            defaults.col = col;
            defaults.errorTime = new Date().getTime();
            if (error && error.stack) {
                // 如果浏览器有堆栈信息，直接使用
                defaults.errorType = error.stack.toString().split(':')[0];
                defaults.msg = error.stack.toString().split(':')[1];
                defaults.msg = defaults.msg.split('at')[0];
            } else if (arguments.callee) {
                // 尝试通过callee拿堆栈信息
                let ext = [];
                let fn = arguments.callee.caller;
                let floor = 3;
                // 寻找三层 ？？
                while (fn && --floor > 0) {
                    ext.push(fn.toString());
                    if (fn === fn.caller) {
                        break;
                    }
                    fn = fn.caller;
                }
                ext = ext.join(',');
                defaults.errorType = error.stack.toString().split(':')[0];
                defaults.msg = error.stack.toString().split(':')[1];
                defaults.msg = defaults.msg.split('at')[0];
            }
            let str = '';
            for (let i in defaults) {
                if (defaults[i] === null || defaults[i] === undefined) {
                    defaults[i] = 'null';
                }
                str += '&' + i + '=' + defaults[i].toString();
            }
            srt = str.replace('&', '').replace('\n', '').replace(/\s/g, '');
            if (!strlen(srt)) {
                throw new Error('Exceeded the browser limit parameter length');
            }
            new Image().src =
                host +
                '/badjs/error?' +
                (srt +
                    '&type=4&clienttype=' +
                    clienttype +
                    '&from=' +
                    encodeURIComponent(location.href) +
                    '&errorTime=' +
                    new Date().getTime());
        }, 0);
    };
    // 监听静态资源错误
    window.addEventListener(
        'error',
        function(e) {
            // 获取出错对象属性
            let typeName = e.target.localName;
            // 区分js error 和静态资源error
            if (typeName) {
                let errorParam = {
                    sourceUrl: '' // 资源加载路径
                };
                // 判断是什么元素出错
                if (typeName == 'script') {
                    // script加载出错
                    errorParam.sourceUrl = e.target.src;
                } else if (typeName == 'img') {
                    // img 加载出错
                    errorParam.sourceUrl = e.target.src;
                } else if (typeName == 'link') {
                    // link 加载出错
                    errorParam.sourceUrl = e.target.href;
                }
                // css 加载出错
                let str =
                    'errorType=' +
                    typeName +
                    ' lood error' +
                    '&type=' +
                    3 +
                    '&from=' +
                    encodeURIComponent(location.href) +
                    '&errorURL=' +
                    encodeURIComponent(errorParam.sourceUrl) +
                    '&clienttype=' +
                    clienttype +
                    '&errorTime=' +
                    new Date().getTime();
                if (!strlen(str)) {
                    throw new Error('Exceeded the browser limit parameter length');
                }
                new Image().src = host + '/badjs/error?' + str;
            }
        },
        true
    );
    // 校验参数长度
    function strlen(str) {
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            // 取出单个字符
            let c = str.charCodeAt(i);
            // 单字节加1 ，0~9，a~z
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            } else {
                len += 2;
            }
        }
        if (len > 2083 || len > 65536 || len > 80000 || len > 8182) {
            return false;
        } else {
            return true;
        }
    }
};
window.badJS({
    // host: 'http://192.168.80.10:3001', //线上地址
    host: 'http://localhost:3001', // 线下地址
    clienttype: 0
});

var BadJs = function() {
    "use strict";
    Array.prototype.includes || (Array.prototype.includes = function(t, e) {
            if (null == this) throw new TypeError('"this" is null or not defined');
            var n = Object(this),
                r = n.length >>> 0;
            if (0 == r) return !1;
            var o, i, s = 0 | e,
                a = Math.max(0 <= s ? s : r - Math.abs(s), 0);
            for (; a < r;) {
                if ((o = n[a]) === (i = t) || "number" == typeof o && "number" == typeof i && isNaN(o) && isNaN(i)) return !0;
                a++
            }
            return !1
        }),
        Object.defineProperty || (Object.defineProperty = function(t, e, n) {
            t[e] = n.value
        }),
        "function" != typeof Object.assign && (Object.assign = function(t, e) {
            var n = arguments;
            if (null == t) throw new TypeError("Cannot convert undefined or null to object");
            for (var r = Object(t), o = 1; o < arguments.length; o++) {
                var i = n[o];
                if (null != i)
                    for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (r[s] = i[s])
            }
            return r
        });

    function f(t) {
        return "function" == typeof t
    }

    function y(t) {
        return void 0 === t
    }

    function e(t, e, n) {
        window.addEventListener ? t.addEventListener(e, n, !0) : window.attachEvent && t.attachEvent("on" + e, n)
    }

    function p(t) {
        if ("string" == typeof t) return t;
        var o = [];
        return function t(e) {
                for (var n in e)
                    if (e.hasOwnProperty(n)) {
                        var r = e[n];
                        if ("function" == typeof r || void 0 === r) return;
                        "[object Object]" === Object.prototype.toString.call(r) ? t(r) : o.push(encodeURIComponent(n) + "=" + encodeURIComponent(r))
                    }
            }(t),
            o.join("&")
    }

    function n(t, e) {
        this.reportInstance = e,
            this.errorArr = [],
            this.error(t)
    }
    n.getIntance = function(t, e) {
            return n.instance || (n.instance = new n(t, e)),
                n.instance
        },
        n.prototype.error = function(a) {
            var c = this;
            e(a, "error",
                function(t) {
                    if (t = t || window.event) {
                        var e = t.target || t.srcElement,
                            n = !1;
                        if (6 !== s() && 7 !== s() && (n = e instanceof HTMLScriptElement || e instanceof HTMLLinkElement, e instanceof HTMLImageElement || e instanceof HTMLVideoElement || e instanceof HTMLAudioElement)) return !1;
                        var r = {},
                            o = c.reportInstance;
                        if (n) {
                            var i = e.src || e.href;
                            r.title = "resource" + e,
                                r.msg = i,
                                r.from = location.href
                        } else r.title = t.message,
                            r.msg = t.error && t.error.stack || t.source + ":" + t.message,
                            r.from = location.href,
                            r.lineno = t.lineno,
                            r.colno = t.colno;
                        a.ERROE_POLL.includes(r.title) || (a.ERROE_POLL.push(r.title), o.report && f(o.report) && (n ? o.reportResource(r) : o.report(r)))
                    }

                    function s() {
                        var t = navigator.userAgent,
                            e = -1 < t.indexOf("compatible") && -1 < t.indexOf("MSIE"),
                            n = -1 < t.indexOf("Edge") && !e,
                            r = -1 < t.indexOf("Trident") && -1 < t.indexOf("rv:11.0");
                        if (e) {
                            new RegExp("MSIE (\\d+\\.\\d+);").test(t);
                            var o = parseFloat(RegExp.$1);
                            return 7 == +o ? 7 : 8 == +o ? 8 : 9 == +o ? 9 : 10 == +o ? 10 : 6
                        }
                        return n ? "edge" : r ? 11 : -1
                    }
                })
        };

    function r(t, e) {
        this.reject(t, e)
    }
    r.getIntance = function(t, e) {
            return r.instance || (r.instance = new r(t, e)),
                r.instance
        },
        r.prototype.reject = function(r, t) {
            var o = t;
            e(r, "unhandledrejection",
                function(t) {
                    var e = {};
                    if (t) {
                        var n = "object" == typeof t.reason ? JSON.stringify(t.reason) : t.reason;
                        e.title = "unhandledrejection:" + n,
                            e.from = location.href,
                            e.msg = n,
                            r.ERROE_POLL.includes(e.title) || (r.ERROE_POLL.push(e.title), o.report && f(o.report) && o.report(e))
                    }
                })
        };

    function o(t, e) {
        this.report = e,
            this._window = t,
            this.error()
    }
    o.getIntance = function(t, e) {
            return o.instance || (o.instance = new o(t, e)),
                o.instance
        },
        o.prototype.error = function() {
            var i = this;
            e(this._window, "load",
                function() {
                    var t = i._window.Vue;
                    t && t.config && (t.config.errorHandler = function(t, e, n) {
                        if (!i._window.ERROE_POLL.includes(t)) {
                            i._window.ERROE_POLL.push(t);
                            var r = {};
                            r.title = t,
                                r.msg = n,
                                r.from = location.href;
                            var o = i.report;
                            o.report && f(o.report) && o.report(r)
                        }
                    })
                })
        };

    function i(t, e, n, r) {
        this.startTime = n,
            this.reportInstance = e,
            this.calcWhiteTime(r)
    }
    i.getInstance = function(t, e, n, r) {
            return i.instance || (i.instance = new i(t, e, n, r)),
                i.instance
        },
        i.prototype.calcWhiteTime = function(t) {
            this.reportInstance.reportPerfor({
                whiteTime: t - this.startTime
            })
        };

    function s(t, e, n, r) {
        this.env = t,
            this.startTime = n,
            this.reportInstance = e,
            this.reportFlag = !0,
            this.calcDomReadyTime(r)
    }
    s.getInstance = function(t, e, n, r) {
            return s.instance || (s.instance = new s(t, e, n, r)),
                s.instance
        },
        s.prototype.calcDomReadyTime = function(t) {
            var e = this;
            t ? this.reportInstance.reportPerfor({
                userHandleTime: t - this.startTime
            }) : this.env.document.addEventListener ? this.env.document.addEventListener("DOMContentLoaded",
                function() {
                    e.reportUserHandleTime()
                },
                !1) : this.ieDomReady()
        },
        s.prototype.reportUserHandleTime = function() {
            if (this.reportFlag) {
                var t = (new Date).getTime();
                this.reportInstance.reportPerfor({
                        userHandleTime: t - this.startTime
                    }),
                    this.reportFlag = !1
            }
        },
        s.prototype.ieDomReady = function() {
            var t = this;
            this.scrollJudge();
            var e = window.document;
            e.onreadystatechange = function() {
                "complete" === e.readyState && (e.onreadystatechange = null, t.reportUserHandleTime())
            }
        },
        s.prototype.scrollJudge = function() {
            var e = this;
            try {
                window.document.documentElement.doScroll("left")
            } catch (t) {
                return setTimeout(function() {
                            e.scrollJudge()
                        },
                        10),
                    !1
            }
            this.reportUserHandleTime()
        };

    function a(t, e, n) {
        this.env = t,
            this.startTime = n,
            this.reportInstance = e,
            this.calcDownloadTime()
    }
    a.getInstance = function(t, e, n) {
            return a.instance || (a.instance = new a(t, e, n)),
                a.instance
        },
        a.prototype.calcDownloadTime = function() {
            var e = this,
                n = this.env.onload;
            this.env.onload = function() {
                var t = (new Date).getTime();
                e.reportInstance.reportPerfor({
                        downloadTime: t - e.startTime,
                        isDownload: !0
                    }),
                    n && n()
            }
        };

    function c(t, e, n, r) {
        this.startTime = n,
            this.reportInstance = e,
            this.calcFirstPageTime(r)
    }
    c.getInstance = function(t, e, n, r) {
            return c.instance || (c.instance = new c(t, e, n, r)),
                c.instance
        },
        c.prototype.calcFirstPageTime = function(t) {
            this.reportInstance.reportPerfor({
                firstPageTime: t - this.startTime
            })
        };

    function h(t) {
        this.conf = t || {},
            this.perfInfo = {
                whiteTime: 0,
                downloadTime: 0,
                userHandleTime: 0,
                firstPageTime: 0
            }
    }
    h.getIntance = function(t) {
            return h.instance || (h.instance = new h(t)),
                h.instance
        },
        h.prototype.report = function(e) {
            var t = this;
            if (void 0 === e && (e = {}), window.location && window.location.port && "" !== window.location.port) {
                if (!window.Sentry) {
                    var n = document.createElement("script");
                    n.setAttribute("type", "text/javascript"),
                        n.setAttribute("src", "https://browser.sentry-cdn.com/5.3.0/bundle.min.js"),
                        n.setAttribute("crossorigin", "anonymous"),
                        document.head && document.head.lastChild && (document.head.insertBefore(n, document.head.lastChild), n.onload = function() {
                            window.Sentry && (window.Sentry.init({
                                dsn: "https://" + (t.conf.offlineTest && t.conf.offlineTest.dsn || "e48ec357a3cf4ba1bac23a14f183a4ea") + "@ivs-turbo.cn/" + (t.conf.offlineTest && t.conf.offlineTest.id || 14)
                            }), Sentry.captureMessage(e.title))
                        })
                }
            } else {
                var r = "";
                if (this.conf && this.conf.downgrade && this.conf.downgrade.error) {
                    var o = this.conf.downgrade.error;
                    for (var i in o) o[i].forEach(function(t) {
                        e.msg.match(t) && (r = "_" + i)
                    })
                }
                var s = this.mergeCommonConf("_js_error" + r),
                    a = p(Object.assign(s, e)),
                    c = "" + this.conf.host + this.conf.path + "?" + a,
                    f = new Image;
                f.onload = f.onerror = function() {
                        f = null
                    },
                    f.src = c
            }
        },
        h.prototype.reportResource = function(e) {
            var n = "";
            if (this.conf && this.conf.downgrade && this.conf.downgrade.resource) {
                var t = this.conf.downgrade.resource;
                for (var r in t) t[r].forEach(function(t) {
                    e.msg.match(t) && (n = "_" + r)
                })
            }
            var o = this.mergeCommonConf("_js_error_resource" + n),
                i = p(Object.assign(o, e)),
                s = "" + this.conf.host + this.conf.path + "?" + i,
                a = new Image;
            a.onload = a.onerror = function() {
                    a = null
                },
                a.src = s
        },
        h.prototype.reportPerfor = function(t) {
            var e = this,
                n = !0,
                r = this.mergeCommonConf("_performance", t);
            for (var o in e.perfInfo) e.perfInfo.hasOwnProperty(o) && (e.perfInfo[o] = e.perfInfo[o] || t[o] || 0, 0 == +e.perfInfo[o] && (n = !1), r[o] = e.perfInfo[o]);
            var i = p(r),
                s = "" + this.conf.host + this.conf.path + "?" + i;
            if (n) {
                var a = new Image;
                a.onload = a.onerror = function() {
                        a = null
                    },
                    a.src = s
            }
        },
        h.prototype.mergeCommonConf = function(t) {
            void 0 === t && (t = "");
            var e = this.conf,
                n = e.namespace,
                r = e.type,
                o = e.clienttype,
                i = e.productId,
                s = e.rules,
                a = {};
            if (r) a.type = r;
            else {
                var c = "",
                    f = s.path,
                    p = s.hash,
                    h = window.location.pathname;
                if ("boolean" == typeof f) {
                    var u = h.split("/");
                    u.shift(),
                        c = u.join("_")
                } else if ("object" == typeof f && f) {
                    var l = h.match(f)[0].split("/");
                    l.shift(),
                        c += l.join("_")
                }
                if (p && 0 < location.hash.length) {
                    if ("boolean" == typeof p) {
                        var d = window.location.hash,
                            m = (d ? d.substring(1).split("/") : []).join("_");
                        a.type = c + m + t
                    } else if ("object" == typeof p) {
                        var g = window.location.hash.match(p),
                            v = g && 0 < g.length ? g[0].split("/") : [];
                        a.type = c + v.join("_") + t
                    }
                } else a.type = c + t
            }
            if (n) {
                var w = n + "_" + a.type;
                a.type = w
            }
            return a.productId = i,
                a.clienttype = o,
                a.navigator = y(navigator) ? null : navigator.userAgent,
                a
        },
        window.ERROE_POLL = [];

    function t(t) {
        this.config = this.mergeConf(t),
            this.report = this.report(this.config),
            this.jsError(),
            this.promiseError(),
            this.vueError(),
            this.config.watchPerformance && (this.startTime = (new Date).getTime(), this.download()),
            this.config.isDefaultUserHandle && this.userHandle()
    }
    return t.getIntance = function() {
            return t.instance || (t.instance = new t({})),
                t.instance
        },
        t.prototype.mergeConf = function(t) {
            t = y(t) ? {} : t;
            var e = {
                host: "http://pan.baidu.com",
                path: "/bpapi/analytics",
                namespace: "",
                productId: "",
                type: "",
                rules: {
                    path: !0,
                    hash: !0
                },
                clienttype: 0,
                vueError: !0,
                jsError: !0,
                promiseError: !0,
                watchPerformance: !0,
                isDefaultUserHandle: !0,
                env: window,
                report: h.getIntance
            };
            if (!t.report || f(t.report)) return Object.assign(e, t);
            console.error("report must is function")
        },
        t.prototype.jsError = function() {
            this.config.jsError && n.getIntance(this.config.env, this.report)
        },
        t.prototype.promiseError = function() {
            this.config.promiseError && r.getIntance(this.config.env, this.report)
        },
        t.prototype.vueError = function() {
            this.config.vueError && o.getIntance(this.config.env, this.report)
        },
        t.prototype.whiteTime = function(t) {
            if (!this.config.watchPerformance || !t) return "";
            i.getInstance(this.config.env, this.report, this.startTime, t)
        },
        t.prototype.userHandle = function(t) {
            s.getInstance(this.config.env, this.report, this.startTime, t)
        },
        t.prototype.download = function() {
            a.getInstance(this.config.env, this.report, this.startTime)
        },
        t.prototype.firstPageTime = function(t) {
            if (!this.config.watchPerformance || !t) return "";
            c.getInstance(this.config.env, this.report, this.startTime, t)
        },
        t.prototype.report = function(t) {
            return this.config.report(t)
        },
        t
}();