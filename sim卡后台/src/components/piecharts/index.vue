<template>
    <div ref="chart" class="bs-charts"></div>  
</template>

<script>
let { echarts } = require("@/public/js/echarts.min.js");
export default {
    watch: {
        option(val){
            echarts.init(this.$refs.chart).setOption(val);
        }
    },

    props: {
        option: {
            type: Object,
            default: null
        }
    }
}
</script>


<style lang="scss" scoped>
.bs-charts {
  height: 100%;
}
</style>
