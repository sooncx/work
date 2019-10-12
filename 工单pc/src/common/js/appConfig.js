var USERTOKEN = {
    cd103: "c2e607f7-523b-4a3c-953c-697c7cfb7c0d",
    cd76: "407437f9-4cf4-47b3-a076-53e7a00fe81b",
    fm163:"42db5009-801c-48d7-b348-7d39a00573fe",
    international:"2c1f2dec-a686-48cb-81db-ec5356bd14ec"
  };
var getToken = function (user) {
    return USERTOKEN[user.toLowerCase()];
};

function getUrl() {
    var path = "";
    var cookiePath= getCookie("ajaxPath");
    if(cookiePath==='null'){
        cookiePath=null
    }
    var Url =cookiePath||""
    if(!cookiePath){
        var userconfig = JSON.parse(window.localStorage.getItem("ucf"));
        // var Url = "http://120.77.97.58:8080";
        if (userconfig != null && (userconfig.url != null && userconfig.url != "")) {
            Url += userconfig.url
        }
        if (
            userconfig != null &&
            (userconfig.path != null && userconfig.path != "")
        ) {
            path = getToken(userconfig.path);
        }
    }
    return {
        url: Url,
        path: path
    };
}
var setAppConfig=function(IS_DEV){
    var _host=getUrl() || null
    Vue.prototype.loginToken=_host? _host.path: ""
    Vue.prototype.HOST=_host? _host.url: ""
    Vue.prototype.ERROR_MSG="网络异常，请稍后再试"
    if(IS_DEV){
        Vue.prototype.HOST =Vue.prototype.HOST||"/apiAjax"
        Vue.prototype.HOST7515="/host7515"
        Vue.prototype.demoapi="http://120.76.217.214:6404"
    }else{
        Vue.prototype.HOST7515="http://120.76.69.92:7515"
        Vue.prototype.demoapi="http://120.76.217.214:6404"
    }
}
var initVueLazyload=function(){
    if(window["VueLazyload"]){
        Vue.use(VueLazyload,{
            loading:require("@/assets/img/Spinner-1s-200px.svg")
        })
    }
    
}
var initAppConfig=function(IS_DEV){
    initVueLazyload();
    
    setAppConfig(IS_DEV);

    
}
export {
    getToken,setAppConfig,initAppConfig
}