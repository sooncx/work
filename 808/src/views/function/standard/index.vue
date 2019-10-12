<template>
  <div v-if="displayData" class="text-item-page">
    <info title="电话测试" class="test-info-chunk" :data="displayData" />
    <div class="log-wrap">
      <logTable class="log-table-box" />
    </div>
  </div>
</template>
<script>

import info from './../components/info/'
import logTable from './../components/logTable'
export default {
  name: 'FunctionStandard',
  components: { info, logTable },
  computed: {
    displayData() {
      return this.$store.state.testFunction.activeFunction
    }
  }
}
</script>
<style lang="scss" scoped>
.text-item-page{
  display: flex;
  flex-direction: column;
  >.test-info-chunk{
    max-height: 250px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  >.log-wrap{
    flex: 1;
    background-color: #fff;
    position: relative;
    >.log-table-box{
      position: absolute;
      height: 100%;
      width: 100%;
      left:0;top:0;
    }
  }
}
</style>

