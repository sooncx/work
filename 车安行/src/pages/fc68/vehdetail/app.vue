<template>
  <div class="fc68 app-wrap" v-loading="isloadingApi" element-loading-text="正在获取车辆数据">
    <div class="appChildCont">
      <gaodeMap ref="gaodeMap"  @createdMapAfter="createdMapAfter" :mapIcons="mapIcons"></gaodeMap>
    </div>
    <div v-show="false">
      <mapInfoCar ref="mapInfoCar" @close="closeInfoWindow" :data="curShowCarData"/>
    </div>
  </div>
</template>
<script>
import gaodeMap from "@/components/gaodeMap";
import mapInfoCar from "@/components/mapInfoCar";
export default {
  data() {
    return {
      mapIcons: [],
      terminalNo: getQueryString("terminalNo"),
      key: "d84259f8-ded7-4387-a222-0e03ceb363bf",
      showCarDataList: [],
      mapMarkList: {},
      map: null,
      mapInfoWindow: null,
      isloadingApi:true
    };
  },
  components: {
    gaodeMap,
    mapInfoCar
  },
  computed: {
    curShowCarData() {
      return this.showCarDataList[0];
    }
  },
  created() {
    if (!this.terminalNo) {
      this.$alert("设备号不能为空", {
        showClose: false,
        showConfirmButton: false
      });
      return false;
    }
    this.init();
  },
  mounted() {
    this.mapIcons = [
      {
        icon: "icon-diqiu",
        callBack: this.$refs["gaodeMap"].toggleMapSatellite
      },
      {
        icon: "icon-lukuang1",
        callBack: this.$refs["gaodeMap"].toggleMapTraffic
      }
      // {
      //   icon: "icon-qiche",
      //   icon1:"icon-qiche active",
      //   callBack: this.toggleMapCenter
      // }
    ];
  },
  methods: {
    init() {
      this.getVehInfo();
    },
    getVehInfo() {
      this.$http({
        url: this.HOST7515 + "/VehicleData/GetPosDataByNo.json",
        params: {
          key: this.key,
          terminalNo: this.terminalNo
        }
      })
        .then(rst => {
          if (rst.flag === 1) {
            if (rst.obj&&JSON.stringify(rst.obj)!=="{}") {
              Object.keys(rst.obj).map(key => {
                var item = CarUtil.handerCarData7515(rst.obj[key]);
                item.md;
                this.showCarDataList.push(item);
              });
              this.$set(this, "showCarDataList", (this.showCarDataList&&this.showCarDataList.length>0)?this.showCarDataList.slice(0,1):[]);
              this.updateShowInMap();
            }else{
              this.$alert("暂无车辆相关信息")
            }
            
          } else {
            this.$alert(rst.msg, {
              // showClose: false,
              // showConfirmButton: false
            });
          }
          this.isloadingApi=false
        })
        .catch(e => {
          this.isloadingApi=false
          console.error(e);
          this.$alert("网络异常，请稍后再试", {
            // showClose: false,
            // showConfirmButton: false
          });
        });
    },
    createdMapAfter(map) {
      this.map = map;
      this.updateShowInMap();
    },
    updateShowInMap() {
      if (this.map) {
        if(this.showCarDataList&&this.showCarDataList[0]&&this.showCarDataList[0].canShowMap===false){
          this.$alert("车辆从未上线", {
          });
          return false
        }
        this.showCarDataList.map(item => {
          var tNo = item.terminalNo;
          if (this.mapMarkList[tNo]) {
            this.updateMark(this.mapMarkList[tNo], item);
          } else {
            this.mapMarkList[tNo] = this.createMark(item);
            // this.map.set*()
            this.mapMarkList[tNo].setMap(this.map);
          }
        });
        this.$nextTick(function() {
          if (
            this.showCarDataList.length > 0
          ) {
            this.map.setCenter(
              this.mapMarkList[this.curShowCarData["terminalNo"]].getPosition()
            );
             this.mapMarkList[this.curShowCarData["terminalNo"]].off("click")
            this.mapMarkList[this.curShowCarData["terminalNo"]].on("click",()=>{
              if(this.mapInfoWindow){
                if(this.mapInfoWindow.getIsOpen()){
                  this.closeInfoWindow()
                }else{
                  this.mapInfoWindow.open(this.map,
        this.mapMarkList[this.curShowCarData["terminalNo"]].getPosition())
                }
                
              }
            })
            this.openShowInfoWindow();
          }
        });
      }
    },
    updateMark(mark, data) {
      mark.setPosition(
        new AMap.LngLat(carData["point"].lon, carData["point"].lat)
      );
      mark.setIcon(
        new AMap.Icon(
          Object.assign(CarUtil.getMapDefaulOp(), { image: data.mapImg })
        )
      );
    },
    createMark(data) {
      var newMark = new AMap.Marker({
        position: new AMap.LngLat(data["point"].lon, data["point"].lat),
        offset: new AMap.Pixel(-20, -20),
        // content:this.getMarkeContent(data)
        icon: new AMap.Icon(
          Object.assign(CarUtil.getMapDefaulOp(), {
            image: data.mapImg
          })
        )
      });
      return newMark;
    },
    openShowInfoWindow() {
      if (!this.curShowCarData) {
        return false;
      }
      if (!this.mapInfoWindow) {
        this.mapInfoWindow = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          autoMove: true,
          content: this.$refs["mapInfoCar"].$el,
          offset: new AMap.Pixel(-1, -45)
        });
      } else {
        this.mapInfoWindow.setPosition(
          this.mapMarkList[this.curShowCarData["terminalNo"]].getPosition()
        );
        this.mapInfoWindow.setContent(this.$refs["mapInfoCar"].$el);
      }
      this.mapInfoWindow.open(
        this.map,
        this.mapMarkList[this.curShowCarData["terminalNo"]].getPosition()
      );
      this.map.setFitView();
    },
    closeInfoWindow(){
      this.mapInfoWindow&&this.mapInfoWindow.close()
    }
  }
};
</script>
<style lang="less" >
@import "~assets/css/style.less";
@import "~assets/css/lessKey";
</style>
<style lang="less" scoped>
.app-wrap {
  height: 100%;
  .appChildCont {
    height: 100%;
  }
}
</style>

