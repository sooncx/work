import bsjPopover from './index.vue'
const hoverTime = 300 // 停留时间超过才会弹窗显示
let popoverTimer = null // 延迟显示定时器
let mouseoutTimer = null // 延迟隐藏定时器
let bsjPopoverVM = null
function showPoopver({ data, event }) {
  bsjPopoverVM.show({ data, event })
}
function clearTimerHover() {
  popoverTimer && clearTimeout(popoverTimer)
}
function clearMouseoutTimer() {
  mouseoutTimer && clearTimeout(mouseoutTimer)
}
export default {
  install: vue => {
    const bsjPopoverPlugin = vue.extend(bsjPopover)
    const insertDom = () => {
      if (!bsjPopoverVM) {
        bsjPopoverVM = new bsjPopoverPlugin({
          el: document.createElement('div')
        })
        document.body.appendChild(bsjPopoverVM.$el)
      }
    }
    vue.directive('bsjPopover', {
      bind(el, binding) {
        insertDom()
        el.addEventListener('mouseover', function(event) {
          clearTimerHover()
          clearMouseoutTimer()
          popoverTimer = setTimeout(() => {
            showPoopver({ event, data: binding.value })
          }, hoverTime)
        }, false)
        el.addEventListener('mouseout', function() {
          clearTimerHover()

          mouseoutTimer = setTimeout(() => {
            bsjPopoverVM && bsjPopoverVM.hide()
          }, hoverTime)
        }, false)
      },
      update() {}
    })
  }

}
