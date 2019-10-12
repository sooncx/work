<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  methods: {
    appInit() {
      //从缓存中获取用户信息
      let LOGINUSER = JSON.parse(localStorage.getItem("LOGINUSER")) || null;
      if (LOGINUSER) {
        this.$store.commit("GETLOGINUSER", LOGINUSER);
      } else {
        this.$router.push("/login");
      }
    }
  },
  created() {
    this.appInit();
  }
};
</script>

<style lang="scss">
@import "@/public/css/base.scss";
#app {
  height: 100%;
}
</style>
