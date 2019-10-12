<template>
  <div class="bs-pages">
    <bs-nav />
    <div class="bs-content">
      <keep-alive>
          <router-view />
      </keep-alive>
    </div>
  </div>
</template>


<script>
import bsNav from "@/components/nav/";
import { findByGprsBagList } from '@/util/common'
export default {
  data() {
    return {
      findByGprsBagList,
      activeIndex: "1"
    };
  },

  components: {
    bsNav
  },

  created() {
    this.findByGprsBagList();
  },

  beforeRouteEnter(to, from, next) {
    let LOGINUSER = localStorage.getItem("LOGINUSER")
      ? JSON.parse(localStorage.getItem("LOGINUSER"))
      : null;

    if(!LOGINUSER) {
      next('/login');
      return;
    };

    switch(LOGINUSER.userType) {
      case 1:
        next();
        break;
      case 2:
        next('/marketing');
        break;
      default:
        next('/login');
    }

  }
};
</script>

<style scoped lang='scss'>
.bs-pages {
  height: 100%;
  overflow: hidden;
  min-height: 650px;
  min-width: 1250px;
  .bs-content {
    background: #eef1f5;
    height: calc(100% - 90px);
    overflow: hidden;
    padding: 20px;
    position: relative;
  }
}
</style>


