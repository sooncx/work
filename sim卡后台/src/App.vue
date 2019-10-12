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
      const LOGINUSER = JSON.parse(localStorage.getItem("LOGINUSER")) || null;
      LOGINUSER && this.$store.commit("GETLOGINUSER", LOGINUSER)
    }
  },

  created() {
    this.appInit()
  }
};
</script>

<style lang="scss">
@import "@/public/css/base.scss";
#app {
  height: 100%;
}
</style>
