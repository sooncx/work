<template>
    <div ref="chart" class="bs-charts"></div>  
</template>

<script>
let { echarts } = require("@/public/js/echarts.min.js");
import {getOption} from './config'
export default {
    mounted () {
        echarts.init(this.$refs.chart).setOption(getOption());
    }
}
</script>


<style lang="scss" scoped>
.bs-charts {
  height: 100%;
}
</style>
