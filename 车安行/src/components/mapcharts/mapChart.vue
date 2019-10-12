<template>
  <div>
    <div
      v-chartExample
      id="chartExample"
    ></div>
  </div>
</template>
 
<script>
// 首先要 cnpm install echarts
import echarts from "echarts";
import "./china";

export default {
  data() {
    return {};
  },
  directives: {
    chartExample(el, bindings) {
      el.onmousedown = function(e) {
        let mouseX = e.clientX - el.offsetLeft;
        let mouseY = e.clientY - el.offsetTop;
        document.onmousemove = function(e) {
          el.style.left = e.clientX - mouseX + "px";
          el.style.top = e.clientY - mouseY + "px";
        };
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null;
        };
      };
    }
  },
  mounted() {
    let myChart = echarts.init(document.getElementById("chartExample"));
    console.log(myChart);

    let option = {
      series: [
        {
          name: "中国",
          type: "map",
          mapType: "china",
          selectedMode: false, //single 表示单选;multiple表示多选 默认flase不选
          itemStyle: {
            normal: {
              areaColor: "#002A67",
              borderColor: "#0066ba",
              label: {
                show: true //默认是否显示省份名称
              }
            },
            emphasis: {
              areaColor: "#002457",
              label: {
                show: true //选中状态是否显示省份名称
              }
            }
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            },
            emphasis: {
              // 对应的鼠标悬浮效果
              show: false,
              textStyle: {
                color: "red"
              }
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  },
  methods: {}
};
</script>
 
<style scoped>
#chartExample {
  position: absolute;
  width: 100%;
  height: 450px;
}
</style>