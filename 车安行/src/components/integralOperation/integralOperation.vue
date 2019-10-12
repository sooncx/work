<template>
  <div class="main">
    <div class="foot">
      <span style="margin:0 20px;font-size:14px;color:#333333;">提成积分</span>
      <input
        placeholder="请输入需要提成的积分"
        type="text"
        class="input1"
        :value="input1"
      >
      <p class="explain1">提成积分50=人民币30元</p>

      <span style="margin:0 20px;font-size:14px;color:#333333;">积分提现</span>
      <input
        placeholder="请输入需要提现的积分"
        type="text"
        class="input1"
        :value="input2"
      >
      <button class="footBtn1">提现</button>
      <div style="margin-bottom:10px"></div>
      <span style="margin:0 20px;font-size:14px;color:#333333;">积分转换</span>
      <input
        placeholder="请输入需要转换的积分"
        type="text"
        class="input1"
        :value="input3"
      >
      <button class="footBtn1">转换</button>
      <p class="explain1">提成积分转消费积分</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input1: 1,
      input2: 2,
      input3: 3
    };
  }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
}

.foot {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
  width: 100%;
  // display: flex;
  // align-items: center;
  height: auto;
  padding: 20px 0;
  margin: 20px auto;
  .input1 {
    width: 166px;
    height: 30px;
    padding: 10px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 225, 225, 1);
  }
  .explain1 {
    width: 166px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(230, 240, 255, 1);
    margin-left: 99px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
.footBtn1 {
  width: 84px;
  height: 30px;
  background: rgba(2, 80, 193, 1);
  border: none;
  font-size: 13px;
  color: #ffffff;
  margin-left: 10px;
  cursor: pointer;
}
</style>

