// import config from "./../config";
// const { wsUrl } = config;

class wsUtil {
  constructor(op) {
    this.normalCloseCode = 1005 // 正常关闭的状态码
    this.ws = null
    this.heartneatTimer = null
    this.relinkTimer = null
    this.op = Object.assign(
      {
        heartneat: {
          time: 30000, // 心跳时间
          data: '{heart:123456789}', // 心跳发送数据
          filterData: 'WebSocket' // 心跳服务器返回的数据，过滤
        },
        relinkRime: 5000, // webSoket 自动重连时间
        isNotRelink: false // 是否禁止webSoket自动重连
      },
      op
    )
    this.init()
  }
  init() {
    this.ws = new WebSocket(this.op.url)

    this.bindEvent()
  }
  close() {
    // 关闭连接
    this.ws && this.ws.close()
  }
  send({ data, isHeartbeat = false }) {
    // 使用连接发送数据

    this.ws && this.ws.send(data)
    if (!isHeartbeat) {
      console.log(data, '发送数据')
      // 非发送心跳数据的，重新计算心跳数据时间
      this.forHeartbeat()
    }
  }
  bindEvent() {
    var ws = this.ws
    var op = this.op
    window.ws = ws
    ws.onopen = evt => {
      console.warn('ws连接成功')
      if (typeof op.onopen === 'function') op.onopen(evt)
      this.forHeartbeat()
    }
    ws.onmessage = evt => {
      if (
        typeof op.onmessage === 'function' &&
        evt.data !== this.op.heartneat.filterData
      ) {
        console.log('收到数据', evt.data, evt, '-')
        var result = evt.data
        try {
          if (typeof evt.data === 'string' && evt.data) {
            result = JSON.parse(evt.data)
          }
        } catch (e) {
          // console.error(e)
        }
        op.onmessage(result, evt)
      }
    }
    ws.onclose = evt => {
      console.error('ws连接关闭', evt)
      this.clearHeartneatTimer()
      if (this.normalCloseCode !== evt.code) { // 非正常关闭
        if (typeof op.onerror === 'function') {
          op.onerror(evt)
          console.log('')
        }
        // 非正常关闭，自动重连
        this.relink()
      } else { // 正常关闭
        if (typeof op.onclose === 'function') op.onclose(evt)
      }
    }
    ws.onerror = evt => {
      console.error('ws连接异常', evt)
      if (typeof op.onerror === 'function') op.onerror(evt)
      this.clearHeartneatTimer()
      this.relink()
    }
  }
  relink() {
    // 重新连接
    if (this.op.isNotRelink) return
    this.clearRelinkTimer()
    this.relinkTimer = setTimeout(() => {
      this.init()
      this.warn('webSocket发送错误,重新连接')
    }, this.op.relinkRime)
  }
  clearRelinkTimer() {
    this.relinkTimer && clearTimeout(this.relinkTimer)
  }
  forHeartbeat() {
    // 循环发送心跳
    var sendData = this.op.heartneat.data
    this.clearHeartneatTimer()
    this.heartneatTimer = setTimeout(() => {
      this.send({ data: sendData, isHeartbeat: true })
      this.forHeartbeat()
    }, this.op.heartneat.time)
  }
  clearHeartneatTimer() {
    // 清除心跳定时器
    this.heartneatTimer && clearTimeout(this.heartneatTimer)
  }
  warn(msg) {
    console.warn(msg)
  }
  devCall() {
    // 模拟返回数据
    var op = this.op
    if (typeof op.onmessage === 'function') {
      op.onmessage({
        data: JSON.stringify({
          alarmId: 1,
          plate: '粤awjekj',
          type: 1002,
          vehicleId: 123,
          alarmTime: '2019-3-18'
        }),
        defaultPrevented: false,
        eventPhase: 2,
        isTrusted: true
      })
    }
  }
}
export default wsUtil
