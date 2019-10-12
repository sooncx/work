/*
根据https://github.com/RekingZhang/axios-jsonp修改
    1、修改返回传过来的axios.config信息
    2、请求callback的这个key值可以配置
        如callback修改为jsoncallback:
            this.$http({
                url: this.HOST_76 + "/LbsMulti/v1.json?",
                params: {
                    MoreLBS: "1@1@42307,55111,0"
                },
                callbackName: "jsoncallback",
                method: "get",
                adapter: "jsonp"
            }).then()
        
            return {
                data:{},
                status:200,
                isJSONP:true,
                config:{...}
            }
    3 、新增jsonp script请求访问失败返回404信息
            failtRst={
                isJSONP: true,
                config: config,
                response: {
                    status: 404,
                    msg: "请求失败，请检查网络"
                }
            }

*/
var cid = 1;

function buildParams(params) {
  var result = [];

  for (var i in params) {
    result.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
  }

  return result.join('&');
};

function jsonpAdapter(config) {
  var _params = {};
  var _defalutOp = {
    callbackName: "callback"
  };
  if (config.callbackName && typeof config.callbackName === "string") {
    _defalutOp.callbackName = config.callbackName;
  };
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    var src = config.url;
    if (config.params) {
      var params = buildParams(config.params);

      if (params) {
        src += (src.indexOf('?') >= 0 ? '&' : '?') + params;
      }
    }

    script.async = true;

    var jsonp = 'axiosJsonpCallback' + cid++;
    var old = window[jsonp];
    var isAbort = false;

    window[jsonp] = function (responseData) {
      window[jsonp] = old;

      if (isAbort) {
        return;
      }

      var response = {
        isJSONP: true,
        data: responseData,
        status: 200,
        config: config
      };
      resolve(response);
    };
    _params = {
      _: (new Date().getTime())
    };
    _params[_defalutOp["callbackName"]] = jsonp;
    src += (src.indexOf('?') >= 0 ? '&' : '?') + buildParams(_params);
    script.onerror = function (e) {
      var failRst = {
        isJSONP: true,
        config: config,
        response: {
          status: 404,
          msg: "请求失败，请检查网络"
        }
      }
      reject()
      console.log(e, 'jsonp请求载失败')
    };
    script.onload = script.onreadystatechange = function () {

      if (!script.readyState || /loaded|complete/.test(script.readyState)) {

        script.onload = script.onreadystatechange = null;

        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }

        script = null;
      }
    };

    if (config.cancelToken) {
      config.cancelToken.promise.then(function (cancel) {
        if (!script) {
          return;
        }

        isAbort = true;
        reject(cancel);
      });
    }

    script.src = src;

    document.head.appendChild(script);
  });
};
export default jsonpAdapter;
