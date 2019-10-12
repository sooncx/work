
<script>
export default {
  props: {
      mapType:{
       type:String,
       default:"amap",
     },
     selectVehs:{
       type:Object,
       default:function(){
         return {}
       }
     },
  },
  data() {
    return {
      carMapInfoList: {},
      zIndex: 60,
      map: null,
      carImgSize: {
        width: 32,
        height: 40
      },
      infoWindow: null,
      showInfoData: {}, //当前气泡框的信息
      RelevanceList: [],
      curSelectCar: {}, //当前选中的车辆。跟showInfoData的区别是（showInfoData可以是关联车辆的）
      relevanceMarkList: {}, //关联车辆mark
      alarm_erImg: require("@/assets/img/map/alarm_er.png"),
      glCarMarkImg: require("@/assets/img/map/glCarMark.png"),
      markSize: {
        width: 26,
        height: 37
      }
    };
  },
  methods: {
    canShowMap(carData){ //检查当前车辆是否能显示在地图上 
        return CarUtil.canShowMap(carData)
    },
    setCurMark(carData, mark) {
      //设置当前车辆marker
      var vid = carData.vehicleId;
      if (this.isGuanlian(carData)) {
        if (!this.relevanceMarkList[vid]) {
          this.relevanceMarkList[vid] = {};
        }
        this.relevanceMarkList[vid].data=carData
        this.relevanceMarkList[vid].marker = mark;
      } else {
        if (!this.carMapInfoList[vid]) {
          this.carMapInfoList[vid] = {};
        }
        this.carMapInfoList[vid].marker = mark;
        this.carMapInfoList[vid].data=carData
      }
    },
    getCurMark(carData) {
      //获取当前车辆id的marker
      var vid = carData.vehicleId;

      if (this.isGuanlian(carData)) {
        if (this.relevanceMarkList[vid]) {
          return this.relevanceMarkList[vid].marker;
        } else {
          return false;
        }
      } else if (this.carMapInfoList[vid]) {
        return this.carMapInfoList[vid].marker;
      } else {
        return false;
      }
    },

    removeCurMapInfo(carData) {
      //删除carMapInfoList|relevanceMarkList中当前车辆的marker包括lable
      var dataKey=""
      var vid=carData.vehicleId
      if(this.isGuanlian(carData)){
          dataKey="relevanceMarkList"
      }else{
          dataKey="carMapInfoList"
      };
      if (this[dataKey][vid]) {
        if (this[dataKey][vid].marker) {
          this.removeCurMark(this[dataKey][vid].marker);
        }
        if (this[dataKey][vid].label) {
          this.removeCurLabel(this[dataKey][vid].label);
        }
      }
      delete this[dataKey][vid];
    },
    addCurCarMark(carData) {
      //添加车辆标识 给父组件使用
      var curMark = this.getCurMark(carData);
      if (!curMark) {
        //如果之前没有这台车的mark
        curMark = this.createCurMark(carData);
       
        this.setCurMark(carData, curMark);
      } else {
        //更新车辆图标
        this.updateCurMark(curMark, carData);
      }
    },
    handlerSelectCurVh(carData, type) {
      //选中当前车辆(车组列表，地图两种选中方式，地图选中不需要居中)
      this.showInfoData = carData;
      if (type === "carList" || type === "relevanceList") {
        this.showCurVhMap(carData);
      }
      if (!carData["_isGuanlian"]) {
        //如果是关联设备车辆，当前选择的主车辆时一样的
        this.curSelectCar = carData;
      }
    },
    showCurVhMap(carData) {
      //选中聚焦当前车辆
      this.setMapCenter(carData);
      this.openInfoWindow(carData);
    },
    doShowRelevanceMark(glCarData) {
      //选中关联设备
      if( this.canShowMap(glCarData) ){
          this.handlerSelectCurVh(glCarData, "relevanceList");
      }
      
    },
    isGuanlian(carData) {
      return carData["_isGuanlian"];
    },
    genRelevanceMark(dataList) {
      //生成关联设备列表
      dataList.forEach(item => {
        if (this.isGuanlian(item)&&this.canShowMap(item)) {
          this.addCurCarMark(item);
        }
      });
    },
    removeRelevanceMark() {
      //删除关联设备列表
      Object.keys(this.relevanceMarkList).forEach(itemKey => {

          this.removeCurMapInfo(this.relevanceMarkList[itemKey].data)
      });
    }
  },
  beforeDestroy() {
    //当前组件销毁前
    this.destroy();
  },
};
</script>
<style lang="less">
.map-relevanceList {
  position: absolute;
  min-width: 200px;
  max-height: 300px;
  background: #fff;
  bottom: 0;
  left: 0;
}
</style>
