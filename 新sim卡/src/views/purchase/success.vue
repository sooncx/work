<template>
    <div class="fix-center">
        <div class="success_img">
            <img src="../../public/img/purchase/scucess.png"/>
        </div>
        <h2 class="success_ft">
            恭喜,下单成功
        </h2>
        <p class="success_span">
            我司业务人员将尽快联系您
        </p>
        <p class="success_span">
            订单号：{{type}}
        </p>
        
        <div class="success_btn" @click="$emit('Tolink','home')">
            继续选购
        </div>
    </div>
</template>


<script>
export default {
    props: ["type"],
    mounted () {
        console.log(this.type)
    }
};
</script>


<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.success_img {
  width: 120px;
  margin: auto;
  img {
    margin-left: 10px;
    width: 100%;
  }
}
.success_ft {
  font-size: 24px;
  font-family: PingFang-SC-Bold;
  text-align: center;
  margin: 50px 0 35px;
  font-weight: bold;
  color: rgba(55, 59, 63, 1);
}
.success_span {
  color: #6a7077;
  font-size: 16px;
  text-align: center;
  &:nth-child(4) {
    margin: 25px 0 45px;
    display: inline-block;
  }
}
.success_btn {
  width: 120px;
  height: 30px;
  background: rgba(28, 94, 214, 1);
  border-radius: 4px;
  line-height: 30px;
  margin: auto;
  @include btn1;
}
</style>


