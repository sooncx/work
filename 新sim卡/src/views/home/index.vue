<template>
  <div
    class="bs-pages"
    @click="sendClick"
  >
    <bs-nav />
    <div class="bs-content">
      <router-view />
    </div>
  </div>
</template>


<script>
import bsNav from "@/components/nav/";
export default {
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    sendClick() {
      this.$root.$emit("visible");
    },
    async setSimList() {
      let store = this.$store.state;
      let data = await this.$API.findByGprsBagList();

      if (data.code == 0) {
        let simList = [
          {
            value: "",
            label: "全部套餐"
          }
        ];
        data.data.map(item => {
          item.value = item.gprsType;
          item.label = item.gprsType;
          simList.push(item);
        });
        store.simList = simList;
      }
      if (this.$store.state.userList.length == 0) {
        var user = await this.$API.getNextUserInfo({
          userId: store.LOGINUSER.id
        });
        this.$store.commit("GETUSERLIST", user.data);
      }
    }
  },
  components: {
    bsNav
  },

  created() {
    this.setSimList();
  }
};
</script>

<style scoped lang='scss'>
.bs-pages {
  height: 100%;
  overflow: hidden;
  min-height: 650px;
  min-width: 1100px;
  .bs-content {
    background: #edf2f8;
    height: calc(100% - 50px);
    overflow-y: hidden;
    position: relative;
  }
}
</style>


