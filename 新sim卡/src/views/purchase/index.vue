<template>
  <div class="purchase-box">
    <div
      class="select_box"
      v-if="iscomponent == 'home'|| iscomponent == 'report'"
    >
      <!-- <div class="select_btn" @click="active = 1;iscomponent= 'home'" :class="{'select_active':active == 1}">
          购卡
        </div> -->
      <div
        class="select_btn"
        @click="active = 2;iscomponent= 'report'"
        :class="{'select_active':active == 2}"
      >
        历史
      </div>
    </div>
    <component
      @Tolink="toView"
      :is="iscomponent"
      :type="supType"
    ></component>
    <!-- <router-view /> -->
  </div>
</template>


<script>
import detail from "./detail";
import home from "./home";
import success from "./success";
import report from "./report";
export default {
  data() {
    return {
      iscomponent: "home",
      supType: "",
      active: 1
    };
  },
  components: {
    home,
    detail,
    success,
    report
  },
  methods: {
    toView(path, item) {
      if (item) {
        this.supType = item;
      }
      this.iscomponent = path;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/mixin.scss";
.purchase-box {
  margin: 17px 24px;
  background: #fff;
  height: calc(100% - 34px);
  .select_box {
    padding-top: 10px;
    display: flex;
  }
  .select_btn {
    // float: left;
    width: 100px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .select_active {
    color: #4b88f6;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -25%;
      bottom: 0;
      width: 50%;
      height: 2px;
      background: #4b88f6;
    }
  }
}
</style>

