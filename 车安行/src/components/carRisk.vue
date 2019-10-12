<template>
  <div class="main">
    <div
      v-for="(item,index) in data"
      :key="index"
    >
      <div class="box">
        <span class="img">
          <img
            :src="item.imgurl"
            alt=""
          >
        </span>
        <span class="txt">
          <p>{{item.name}}</p>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    }
  },
  methods: {}
};
</script>


<style lang="less" scoped>
.main {
  margin-left: 8px;
  margin-top: -8px;
  .box {
    position: relative;
    width: 46%;
    height: 110px;
    background-color: #003175;
    float: left;
    margin-left: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    .img {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
    }
    .txt {
      position: absolute;
      top: 50%;
      left: 110px;
      transform: translateY(-50%);
      color: white;
      font-size: 14px;
    }
  }
}
</style>

