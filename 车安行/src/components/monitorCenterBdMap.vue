<!--监控中心百度地图-->
<template>
  <div class="bdmap-wrap">
      <div class="bdmap" ref="bdmap"></div>
      <div v-show="false">
          <monitorCenterInfoWindow ref="info" :data="showInfoData" />
      </div>
      <relevance-list :data="curSelectCar"  @removeMark="removeRelevanceMark"  @genMark="genRelevanceMark"  @doShowRelevanceMark="doShowRelevanceMark" class="map-relevanceList" />
  </div>
</template>
<script>
import bdmap from "@/components/bdmap";
import monitorCenterMapMixin from "@/components/monitorCenterMapMixin";
import monitorCenterInfoWindow from "@/components/monitorCenterInfoWindow";
import relevanceList from "@/components/relevanceList"
export default {
  mixins: [bdmap, monitorCenterMapMixin],
  components:{monitorCenterInfoWindow,relevanceList},
  methods: {
    createCurMark(carData) {
      //创建车辆图标
      var icon=null;
      var angle=0
      if(this.isGuanlian(carData)){
        icon=new BMap.Icon(this.glCarMarkImg, new BMap.Size(this.markSize.width, this.markSize.height))
      }else{
        icon=new BMap.Icon(CarUtil.getStatusImg(carData), new BMap.Size(this.carImgSize.width, this.carImgSize.height));
        angle=carData.angle;
      }
      var resultMark = new BMap.Marker(new BMap.Point(carData.bdX, carData.bdY),{
            icon: icon,
            rotation:angle
          });
          this.map.addOverlay(resultMark); 
          resultMark.removeEventListener("click")
          resultMark.addEventListener("click",()=>{
              if(this.showInfoData.vehicleId === carData.vehicleId){ //如果之前就是当前选中车辆
                if(this.infoWindow.isOpen()){ //如果之前是打开 现在就关闭
                    this.infoWindow.close();
                }else{
                  this.openInfoWindow(carData);
                }
            }else{
              this.handlerSelectCurVh(carData)
              this.openInfoWindow(carData)
            }
          });
          // resultMark.
        return resultMark
    },
    updateCurMark(itemMarker, carData) {
      if(!this.isGuanlian(carData)){
          itemMarker.setIcon( new BMap.Icon(CarUtil.getStatusImg(carData), new BMap.Size(this.carImgSize.width, this.carImgSize.height)));
           itemMarker.setRotation(carData.angle);
      }
      itemMarker.setPosition(new BMap.Marker(new BMap.Point(carData.bdX, carData.bdY)));
     
    },
    removeCurMark(mark) {
        this.map.removeOverlay(mark)
    },
    removeCurLabel(label){
        this.map.removeOverlay(label)
    },
    
    setMapCenter(carData){
        this.map.setCenter(new BMap.Point(carData.bdX, carData.bdY));
    },
    openInfoWindow(carData){
        if(!this.infoWindow){
          this.createInfoWindow(carData)
        }else{
          this.updateInfoWindow(carData);
        };
        this.map.openInfoWindow(this.infoWindow,new BMap.Point(carData.bdX, carData.bdY))
    },
    createInfoWindow(carData){
        this.infoWindow=new BMap.InfoWindow(this.$refs["info"].$el);
    },
    updateInfoWindow(carData){

    },
    destroy(){
      debugger
    }
    
  }
};
</script>

