<template>
  <span class="displayInput-sp">{{ count }}</span>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
    }
  },
  computed: {
    logData() {
      return this.$store.state.testFunction.logData
    },
    count() {
      return this.$store.state.testFunction.count || 0
    }
  },
  watch: {
    count(val) {
      if (val === this.data.count) {
        this.$alert('计数完成', '温馨提示', {
          confirmButtonText: '确定'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .displayInput-sp{
  vertical-align: middle;
  display: inline-block;
  padding:2px 5px;
  border:1px solid #ddd;
}
</style>
