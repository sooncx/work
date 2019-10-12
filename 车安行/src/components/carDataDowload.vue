<template>
  <div class="main">
    <div
      v-for="(item,index) in data"
      :key="index"
    >
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          :label=item
          class="check"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkList: []
    };
  },
  watch: {
    checkList: {
      handler(newval, oldval) {
        this.$store.dispatch("setDowloadListRoot", newval);
        this.$emit("getCheckList", newval);
      },
      immediate: true
    }
  },
  props: {
    data: {
      type: Array
    }
  },
  methods: {}
};
</script>


<style lang="less" scoped>
.check {
  width: 220px;
  float: left;
  position: relative;
  left: 20px;
  margin-bottom: 20px;
  color: white;
  font-size: 12px;
}
/deep/ .el-checkbox__inner {
  background: transparent;
  border-color: #004ab6;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: transparent;
}
</style>

