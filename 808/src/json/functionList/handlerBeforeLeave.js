/**
 * 处理功能测试步骤切换前的beforeLeave
 * ***/
import { MessageBox } from 'element-ui'
import store from '@/store'
export function handlerCountStep(item, succCall) {
  console.log(item)
  if (Number(item.count) <= Number(store.state.testFunction.count)) {
    store.dispatch('testFunction/resetCount')
    succCall()
  } else {
    MessageBox.confirm('请在停止计时后离开，否则可能引起计数异常，是否确定离开?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      store.dispatch('testFunction/resetCount')
      succCall()
    })
  }
}
