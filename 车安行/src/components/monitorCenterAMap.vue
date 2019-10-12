<!--监控中心高德地图-->
<template>
  <div class="amap-wrap">
      <div class="amap" ref="amap"></div>
      <div v-show="false">
      <monitorCenterInfoWindow ref="info"  :data="showInfoData"/></div>
  </div>
</template>
<script>
import amap from '@/components/amap'
import monitorCenterMapMixin from '@/components/monitorCenterMapMixin'
import monitorCenterInfoWindow from "@/components/monitorCenterInfoWindow";
export default {
  mixins:[amap,monitorCenterMapMixin],
  components:{monitorCenterInfoWindow},
  methods: {
    createCurMark(carData){ //创建车辆图标
      var resultMark= new AMap.Marker({
        angle:carData.angle,
        position: [carData.x, carData.y],
            icon: new AMap.Icon({            
                size: new AMap.Size(this.carImgSize.width, this.carImgSize.height),  //图标大小
                image: CarUtil.getStatusImg(carData),
            })        
      });
      resultMark.off("click").on("click",()=>{
          if(this.showInfoData.vehicleId === carData.vehicleId){ //如果之前就是当前选中车辆
              if(this.infoWindow.getIsOpen()){ //如果之前是打开 现在就关闭
                  this.infoWindow.close();
              }else{
               this.openInfoWindow(carData);
              }
          }else{
            this.showInfoData=carData
            this.openInfoWindow(carData)
            
          }
      });
      resultMark.setMap(this.map)
      return  resultMark
    },
    updateCurMark(itemMarker,carData){
        itemMarker.setIcon(new AMap.Icon({            
              size: new AMap.Size(this.carImgSize.width, this.carImgSize.height),  //图标大小
              image: CarUtil.getStatusImg(carData),
          }));
        itemMarker.setPosition(new AMap.LngLat(carData.x,  carData.y));
        itemMarker.setAngle(carData.angle)
    },
    removeCurMark(){

    },
    setMapCenter(carData){
        this.map.setCenter([carData.x, carData.y]);
    },
    openInfoWindow(carData){
        if(!this.infoWindow){
          this.createInfoWindow(carData)
        }else{
          this.updateInfoWindow(carData);
        };
        this.infoWindow.open(this.map,new AMap.LngLat(carData.x,  carData.y))
    },
    createInfoWindow(carData){
        this.infoWindow= new AMap.InfoWindow({
          // isCustom:true,
            autoMove: false,
            offset: new AMap.Pixel(10, -25),
          content:this.$refs["info"].$el
        });
    },
    updateInfoWindow(carData){

    }
  }
};
</script>

