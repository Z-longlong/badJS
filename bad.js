  /**
   * host 上传域名地址
   * clienttype 客户端类型 0 后台系统
   */
  window.badJS = function ({
      host,
      clienttype
  }) {
      const PARAMS_MAX_LENGTH = {
          "IE": 2083,
          "Firefox": 65536,
          "Safari": 80000,
          "chrome": 8182
      };
      // type 1 vue error  2 promise error 3 static error  4 jserror
      window.onload = function () {
          let vue = window.globalVue;
          if (vue) {
              // vue error
              vue.constructor.config.errorHandler = function (error, vm, info) {
                  let str = "errorType=" + error.name +
                      "&msg=" + error.message +
                      "&userBehavior=" + info +
                      // encodeURIComponent 防止被截断 URL中含有# 后面会被截断
                      "&from=" + encodeURIComponent(location.href) +
                      "&type='1'&clienttype=" + clienttype + "&errorTime=" + new Date().getTime();
                  if (!strlen(str)) {
                      throw new Error('Exceeded the browser limit parameter length');
                  }
                  (new Image()).src = host + '/badjs/error?' + str;
              };
              // vue warn 生产环境不报错 vue.constructor.config.warnHandler
          }
      };
      // 监听 promise 错误
      window.addEventListener("unhandledrejection", err => {
          err.preventDefault();
          let str = "errorType=Promise error" +
              "&msg=" + err.reason ? err.reason : '未传入错误信息' +
              "&from=" + encodeURIComponent(location.href) +
              "&type=2&clienttype=" + clienttype +
              "&errorTime=" + new Date().getTime();
          if (!strlen(str)) {
              throw new Error('Exceeded the browser limit parameter length');
          }
          (new Image()).src = host + '/badjs/error?' + str;
      }, false);
      // 监听js 错误
      window.onerror = function (msg, url, line, col, error) {
          // 异步防止阻塞
          setTimeout(function () {
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
                  while (fn && (--floor > 0)) {
                      ext.push(fn.toString());
                      if (fn === fn.caller) {
                          break;
                      }
                      fn = fn.caller;
                  }
                  ext = ext.join(",");
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
              (new Image()).src = host + '/badjs/error?' + (srt + "&type=4&clienttype=" + clienttype + "&from=" +
                  encodeURIComponent(location.href) + "&errorTime=" + new Date().getTime());
          }, 0);
      };
      // 监听静态资源错误
      window.addEventListener('error', function (e) {
          // 获取出错对象属性
          let typeName = e.target.localName;
          // 区分js error 和静态资源error
          if (typeName) {
              let errorParam = {
                  sourceUrl: "" // 资源加载路径
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
              let str = "errorType=" + typeName + ' lood error' +
                  "&type=" + 3 +
                  "&from=" + encodeURIComponent(location.href) +
                  "&errorURL=" + encodeURIComponent(errorParam.sourceUrl) +
                  "&clienttype=" + clienttype + "&errorTime=" + new Date().getTime();
              if (!strlen(str)) {
                  throw new Error('Exceeded the browser limit parameter length');
              }
              (new Image()).src = host + '/badjs/error?' + str;
          }
      }, true);
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
      host: 'http://localhost:3001',
      clienttype: 0,
  });