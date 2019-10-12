import popLogDetail from './index.vue'
export default {
  install(vue) {
    let $vm
    vue.prototype.$popLogDetail = (function() {
      const popLogDetailPlugin = vue.extend(popLogDetail)
      $vm = new popLogDetailPlugin({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
      var show = function() {
        $vm && $vm.show.apply($vm, arguments)
      }
      var hide = function() {
        $vm && $vm.hide.apply($vm, arguments)
      }
      return {
        show,
        hide
      }
    })()
  }
}
