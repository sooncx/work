<template>
  <div
    ref="chart"
    class="bs-charts"
    v-loading="loadingFlag"
    element-loading-spinner="el-icon-loading"
    element-loading-background="#151d32"
  ></div>
</template>

<script>
let echarts = require("echarts");
import { getOption } from "./config";
export default {
  props: ["message"],
  data() {
    return {
      loadingFlag: false,
      flag: 1,
      inData: [],
      outData: [],
      stock: {
        inWeek: [],
        inMonth: [],
        outWeek: [],
        outMonth: []
      },
      week: [],
      week2: [],
      lineData: [],
      lineData1: [
        { value: "周一", textStyle: { color: "#B0CCFF" } },
        { value: "周二", textStyle: { color: "#B0CCFF" } },
        { value: "周三", textStyle: { color: "#B0CCFF" } },
        { value: "周四", textStyle: { color: "#B0CCFF" } },
        { value: "周五", textStyle: { color: "#B0CCFF" } },
        { value: "周六", textStyle: { color: "#B0CCFF" } },
        { value: "周日", textStyle: { color: "#B0CCFF" } }
      ],
      lineData2: [
        { value: "1号", textStyle: { color: "#B0CCFF" } },
        { value: "2号", textStyle: { color: "#B0CCFF" } },
        { value: "3号", textStyle: { color: "#B0CCFF" } },
        { value: "4号", textStyle: { color: "#B0CCFF" } },
        { value: "5号", textStyle: { color: "#B0CCFF" } },
        { value: "6号", textStyle: { color: "#B0CCFF" } },
        { value: "7号", textStyle: { color: "#B0CCFF" } },
        { value: "8号", textStyle: { color: "#B0CCFF" } },
        { value: "9号", textStyle: { color: "#B0CCFF" } },
        { value: "10号", textStyle: { color: "#B0CCFF" } },
        { value: "11号", textStyle: { color: "#B0CCFF" } },
        { value: "12号", textStyle: { color: "#B0CCFF" } },
        { value: "13号", textStyle: { color: "#B0CCFF" } },
        { value: "14号", textStyle: { color: "#B0CCFF" } },
        { value: "15号", textStyle: { color: "#B0CCFF" } },
        { value: "16号", textStyle: { color: "#B0CCFF" } },
        { value: "17号", textStyle: { color: "#B0CCFF" } },
        { value: "18号", textStyle: { color: "#B0CCFF" } },
        { value: "19号", textStyle: { color: "#B0CCFF" } },
        { value: "20号", textStyle: { color: "#B0CCFF" } },
        { value: "21号", textStyle: { color: "#B0CCFF" } },
        { value: "22号", textStyle: { color: "#B0CCFF" } },
        { value: "23号", textStyle: { color: "#B0CCFF" } },
        { value: "24号", textStyle: { color: "#B0CCFF" } },
        { value: "25号", textStyle: { color: "#B0CCFF" } },
        { value: "26号", textStyle: { color: "#B0CCFF" } },
        { value: "27号", textStyle: { color: "#B0CCFF" } },
        { value: "28号", textStyle: { color: "#B0CCFF" } },
        { value: "29号", textStyle: { color: "#B0CCFF" } },
        { value: "30号", textStyle: { color: "#B0CCFF" } },
        { value: "31号", textStyle: { color: "#B0CCFF" } }
      ]
    };
  },

  created() {
    this.getCountOfStock();
  },
  methods: {
    getMsg() {
      if (this.flag == 1) {
        this.lineData = this.lineData1;
        this.inData = this.stock.inWeek;
        this.outData = this.stock.outWeek;
        this.setData(this.inData, this.outData, this.lineData);
      } else {
        this.lineData = this.lineData2;
        this.inData = this.stock.inMonth;
        this.outData = this.stock.outMonth;
        this.setData(this.inData, this.outData, this.lineData);
      }
    },
    getCountOfStock() {
      this.loadingFlag = true;
      this.$API
        .getCountOfStock()
        .then(res => {
          let jsonData = JSON.stringify(res.data.inMonth[0]); // 转成JSON格式
          for (let val of res.data.inMonth) {
            for (let i in val) {
              this.stock.inMonth.push(val[i]);
            }
          }
          for (let val of res.data.inWeek) {
            for (let i in val) {
              this.stock.inWeek.push(val[i]);
              //console.log(i);
            }
          }
          for (let val of res.data.outMonth) {
            for (let i in val) {
              this.stock.outMonth.push(val[i]);
            }
          }
          for (let val of res.data.outWeek) {
            for (let i in val) {
              this.stock.outWeek.push(val[i]);
              this.week.push(i);
            }
          }
          this.dateToWeek();
          //console.log("this:" + JSON.stringify(this.lineData1));
          this.setData(this.inData, this.outData, this.lineData);
          this.loadingFlag = false;
        })
        .catch(err => {});
    },
    dateToWeek() {
      var dayCycleArray = [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      ];
      let k = 0;
      for (let i = 0; i < 7; i++) {
        this.week2[i] = new Date(this.week[i]);
        var dayCycle = this.week2[i].getDay();
        //console.log("week:" + dayCycle);
        for (let j = 0; j < 7; j++) {
          if (dayCycle == j) {
            dayCycle = dayCycleArray[j];
            //console.log("week:" + dayCycle);
            this.lineData1[k++].value = dayCycle;
            //console.log(JSON.stringify(this.lineData1[j]));
          }
        }
      }
      //console.log(JSON.stringify(this.lineData1));
    },
    setData(inData, outData, lineData) {
      echarts
        .init(this.$refs.chart)
        .setOption(getOption(inData, outData, lineData));
    }
  },
  watch: {
    message: {
      handler(newValue, oldValue) {
        this.flag = newValue ? newValue : this.flag;
        this.getMsg();
        this.loadingFlag = false;
      }
    }
  },
  mounted() {
    this.setData(this.inData, this.outData, this.lineData);
    this.getMsg();
  }
};
</script>


<style lang="scss" scoped>
.bs-charts {
  height: 100%;
}
</style>
