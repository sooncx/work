module.exports = {
  runtimeCompiler: true,
  devServer: {
    // open: true, //配置自动启动浏览器
    proxy: {
      "/api": {
        target: 'http://sim.car900.com/',
        // target: 'http://192.168.100.226/',
        //target: "http://120.25.254.108/",
        // target: "http://120.25.254.108:9090/",
        //target: "http://192.168.100.226:9090/",
        // target:'http://120.77.133.46:7012/',
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    } // 配置多个代理
  }
};