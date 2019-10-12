import { debounce } from 'lodash'
var scrollList = []
export default {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    var tableScrollId = el.getAttribute('tableScrollId')
    if (!tableScrollId) {
      tableScrollId = scrollList.length + 1
      el.setAttribute('tableScrollId', tableScrollId)
    }
    selectWrap.addEventListener('scroll', debounce(function() {
      scrollList[tableScrollId] = {
        top: this.scrollTop,
        left: this.scrollLeft
      }
    }), 300)
  },
  componentUpdated(el) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    var tableScrollId = el.getAttribute('tableScrollId')
    if (tableScrollId && scrollList[tableScrollId]) {
      const l = scrollList[tableScrollId].left || 0
      const t = scrollList[tableScrollId].top || 0
      setTimeout(() => {
        selectWrap.scrollTo(l, t)
      }, 100)
    }
  },
  update() {}
}
