<template>
  <div class="relevanceList-box">
      <div class="relevanceList-header">
          <div class="col-left">
              <span class="title ver-ali-m">
                  设备列表
              </span>
              <span class=" ver-ali-m">
                  {{onlineCount}}/{{allCount}}
              </span>
              <el-popover
                placement="top-start"
                trigger="hover"
                width="330"
                > 
                <div>
                  如果您的车牌号填写的内容包含标准的车牌。我们则推算为同一辆车。例如：<br/>“李磊 粤A12345 有线”与 “粤A12345 无线1 后备箱”在同一辆车上。
                </div>
                  <i slot="reference" class="iconfont icon-wenti1 c-999 ml-5 pointerStyle"></i>
              </el-popover>
              <el-popover
                placement="top-start"
                trigger="hover"
                >
                <div>
                  此车辆关联设备列表根据<span class="c-blue">{{data.carType | filterCarType}}号匹配</span>匹配
                </div>
                <span  class="carMatch-mark ver-ali-m" slot="reference">{{data.carType | filterCarType}}</span>
              </el-popover>
              
          </div>
          
          <div class="col-right">
              <i class="iconfont  icon-zhankai"></i>
          </div>
      </div>
      <div class="cont-ul">
          <div class="" v-for="item in displayList"> 
              <!-- {{item.plate}} -->
              <relevanceListItem    @click.native="doShowRelevanceMark(item)" :mainData="data" :data="item"/>
          </div>  
      </div>
  </div>
</template>
<script>
import relevanceListItem from "@/components/relevanceListItem";
export default {
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  components: {
    relevanceListItem
  },
  filters: {
    filterCarType(val) {
      switch (val) {
        case 0:
          return "车牌";
        case 1:
          return "车架";
        default:
          return "车牌";
      }
    }
  },
  data() {
    return {
      onlineCount: 0,
      displayList: [],
      prevData: {}
    };
  },
  computed: {
    allCount() {
      return this.displayList.length;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.data && JSON.stringify(this.data) !== "{}") {
        if (this.prevData.vehicleId !== this.data.vehicleId) {
          this.genRelevanceList(this.data);
          this.prevData = Object.assign({}, this.data);
        }
      }
    },
    update() {
      if (this.data && JSON.stringify(this.data) !== "{}") {
        this.genRelevanceList(this.data);
      }
    },

    getDisance(mainData, glCarData) {
      var sDisancei = GetDisance(
        mainData.y,
        mainData.x,
        glCarData.y,
        glCarData.x
      );
      var result = "";
      if (sDisancei > 1000) {
        result = sDisancei / 1000 + "公里";
      } else {
        result = sDisancei + " 米";
      }
      if (IsNaN(result)) {
        result = null;
      }
      return result;
    },
    genRelevanceList(carData) {
      //生成关联设备
      this.RelevanceList = [];
      this.onlineCount = 0;
      this.$emit("removeMark");
      this.getRealTimeByVehListState(carData).then(rst => {
        if (rst.flag === 1) {
          var list = rst.obj || [];
          if (list && list.length > 0) {
            //如果有
            list.sort(function(a, b) {
              //按照上线排序
              var _a = a.X;
              if (_a == undefined) {
                _a = 0;
              }
              var _b = b.X;
              if (_b == undefined) {
                _b = 0;
              }
              return Number(_b) - Number(_a);
            });
            list.forEach(item => {
              item = CarDataKeyTrans.toKey(item);

              if (item.X) {
                this.onlineCount++;
              }
              if (item.V === this.data.vehicleId) {
                //把主设备放在最前面
                item["_isCurrent"] = true;
              } else {
                item["_isGuanlian"] = true;
                item["sDisance"] = this.getDisance(this.data, item);
              }
            });
          }
          this.displayList = list;
          this.$emit("genMark", this.displayList);
        }
      });
    },
    getRealTimeByVehListState(carData) {
      //api获取关联设备列表
      return this.$http({
        url: this.HOST + "/http/CarVehicle/GetRealTimeByVehListState.json",
        params: {
          vehicleId: carData.vehicleId
        }
      });
    },
    doShowRelevanceMark(itemData) {
      //点击列表显示关联设备
      this.$emit("doShowRelevanceMark", itemData);
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function() {
        this.init();
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/lessKey";
.relevanceList-header {
  padding: @SPACE_SIZE;
  border-bottom: 1px solid @c-bor;
  display: flex;
  .col-left {
    flex: 1;
  }
  .col-right {
    padding: 0 @SPACE_SIZE;
  }
}
.carMatch-mark {
  font-size: 12px;
  background: #349cef;
  color: #fff;
  border-radius: 4px;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  transform: scale(0.9);
  -webkit-transform: scale(0.9);
  -moz-transform: scale(0.9);
  -o-transform: scale(0.9);
  cursor: help;
  display: inline-block;
}
</style>
