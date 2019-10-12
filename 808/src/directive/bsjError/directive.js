import bsjError from './bsjError'
import { addClass, removeClass, getStyle } from '@/utils/dom'

/** **
 <div
    class="group-wrap"
    v-bError="isError"
    bError-msg="网络异常"
    :bError-isAutoSize="true"
    @bError-onReset="doReset"
  ></div>
  v-bError boolean  是否显示
  bError-msg String 显示的错误提示文案
  bError-isAutoSize boolean 是否自动计算显示size size默认为small
  bError-onReset  function 显示重新加载的function
 ****/

const directive = {
  type: 'directive'
}
directive.install = vue => {
  const Mask = vue.extend(bsjError)
  const toggleError = (el, binding) => {
    if (binding.value) {
      // 显示
      vue.nextTick(() => {
        el.originalPosition = getStyle(el, 'position');
        ['height', 'width'].forEach(property => {
          el.errorMaskStyle[property] =
            el.getBoundingClientRect()[property] + 'px'
        })
        // 计算自适应大小模板

        insertDom(el, el, binding)
      })
    } else {
      // 隐藏
      vue.nextTick(() => {
        const target = el
        el.errorDomVisible = false
        removeClass(target, 'b-Error-parent--relative')
        el.errorInstance.hide()
      })
    }
  }
  const insertDom = (parent, el, binding) => {
    if (
      !el.errorDomVisible &&
      getStyle(el, 'display') !== 'none' &&
      getStyle(el, 'visibility') !== 'hidden'
    ) {
      if (
        el.originalPosition !== 'absolute' &&
        el.originalPosition !== 'fixed'
      ) {
        addClass(parent, 'b-Error-parent--relative')
      }
      el.errorDomVisible = true
      el.errorInstance.computedSize(
        el.errorMaskStyle.width,
        el.errorMaskStyle.height
      )
      parent.appendChild(el.errorMask)
      vue.nextTick(() => {
        if (el.errorInstance.hiding) {
          el.errorInstance.$emit('after-leave')
        } else {
          el.errorInstance.show()
        }
      })
      el.errorDomInserted = true
    }
  }
  vue.directive('bError', {
    bind: function(el, binding, vnode) {
      const msg = el.getAttribute('bError-msg') || el.getAttribute('b-error-msg')
      const clickResetFunction = vnode.data.on ? vnode.data.on['bError-onReset'] : null
      const isAutoSize =
        vnode.data.attrs['bError-isAutoSize'] === undefined
          ? true
          : vnode.data.attrs['bError-isAutoSize']

      // const vm = vnode.context;

      const errorMask = new Mask({
        el: document.createElement('div'),
        data: {
          msg: msg,
          isAutoSize: isAutoSize,
          hasResetFunction: Boolean(clickResetFunction)
        },
        methods: {
          onClickReset() {
            clickResetFunction && clickResetFunction()
          }
        }
      })
      el.errorInstance = errorMask
      el.errorMask = errorMask.$el
      el.errorMaskStyle = {}
      binding.value && toggleError(el, binding)
    },
    update: function(el, binding, vnode) {
      if (binding.oldValue !== binding.value) {
        toggleError(el, binding)
        console.log('update', binding.value, binding.oldValue)
        el.errorInstance.setMsg(el.getAttribute('bError-msg') || el.getAttribute('b-error-msg'))
        const clickResetFunction = vnode.data.on ? vnode.data.on['bError-onReset'] : null
        el.errorInstance.hasResetFunction = Boolean(clickResetFunction)
      }
    },
    unbind: function(el, binding) {
      if (el.errorDomInserted) {
        el.errorMask &&
          el.errorMask.parentNode &&
          el.errorMask.parentNode.removeChild(el.errorMask)
        toggleError(el, { value: false })
      }
      el.errorInstance && el.errorInstance.$destroy()
    }
  })
}
export default directive
