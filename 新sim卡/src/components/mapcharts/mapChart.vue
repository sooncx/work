<template>
  <div
    ref="chart"
    class="bs-charts"
  ></div>
</template>


<script>
let echarts = require("echarts");
import { getOption } from "./config";
export default {
  props: {
    data: {
      type: Array
    }
  },
  async mounted() {
    const DATAS = [
      { name: "海门", value: 300 },
      { name: "丽水", value: 250 },
      { name: "洛阳", value: 200 },
      { name: "株洲", value: 200 },
      { name: "石家庄", value: 147 },
      { name: "秦皇岛", value: 250 },
      { name: "大庆", value: 279 },
      { name: "广东", value: 500 },
      { name: "背景", value: 500 }
    ];
    let data = await this.$API.getMap();
    echarts.registerMap("china", data);
    echarts.init(this.$refs.chart).setOption(getOption(DATAS));
  }
};
</script>

<style lang="scss" scoped>
.bs-charts {
  height: 100%;
}
</style>

