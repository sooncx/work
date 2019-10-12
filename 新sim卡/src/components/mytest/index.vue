<template>
  <div>
    <button
      @click="cx()"
      style="width:20px;height:20px"
    >{{msg}}</button>
  </div>
</template>

<script>
export default {
  props: ["msg"],
  data() {
    return {};
  },

  created() {},
  methods: {
    cx() {
      this.$emit("update:msg", 2);
    }
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
.test {
  width: 20px;
  height: 20px;
  position: relative;
  right: 100px;
}
</style>
