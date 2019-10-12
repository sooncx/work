import imgsShow from "./imgsShow.vue";
export default {
  install(vue) {
    let $vm;
    vue.prototype.$imgsShow = (function() {
      vue.component(imgsShow.name, imgsShow);
      const imgsShowPlugin = vue.extend(imgsShow);
      $vm = new imgsShowPlugin({
        el: document.createElement("div")
      });
      document.body.appendChild($vm.$el);
      var show = function() {
        $vm && $vm.show.apply($vm, arguments);
      };
      var hide = function() {
        $vm && $vm.hide.apply($vm, arguments);
      };
      return {
        show,
        hide
      };
    })();
  }
};
