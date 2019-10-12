<template>
    <div ref="chart" class="bs-charts"></div>  
</template>

<script>
let echarts = require("echarts");
import {getOption} from './config'
export default {
    props:{
        data: {
            type:Array
        }
    },
    watch : {
        data () {
            echarts.init(this.$refs.chart).setOption(getOption(this.data));
        }
    },
    mounted () {
        // console.log(this.data)
        echarts.init(this.$refs.chart).setOption(getOption(this.data));
    }
}
</script>


<style lang="scss" scoped>
.bs-charts {
  height: 100%;
}
</style>
