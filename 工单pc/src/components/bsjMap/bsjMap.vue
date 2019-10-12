<template>
  <div class="bsjMap">
      <div class="bsjMap-cont">
          <aMap v-if="mapType === 'amap'"  @inited="mapInited"/>
          <bdMap v-else   @inited="mapInited" />
      </div>
  </div>
</template>
<script>
import bdMap from "./bdMap"
import aMap from "./aMap"
import $bsjMapUtil from "./bsjMapUtil"
export default{
    props:{
      mapType:{
        type:String,
        default:"amap"
      }
    },
    components: {
      bdMap,aMap
    },
    data(){
      return{
        mapSatellite:null,
        isShowMapTraffic:null
      }
    },
    created(){
      
       
      this.InUtilDosetMapType();
    },
    methods:{
      InUtilDosetMapType(){
        $bsjMapUtil.setMapType(this.mapType)
      },
      mapInited(map){
        this.map=map
        this.$emit("mapInited",{map:this.map,$bsjMapUtil})
      },
      toggleMapSatellite(isVisible) {
        //切换卫星图
        if (isVisible === undefined) {
          this.isShowMapSatellite = !this.isShowMapSatellite;
          isVisible = this.isShowMapSatellite;
        }
        if (!this.mapSatellite) {
            $bsjMapUtil.handler("createSatellite",this.map)
        }
        if (isVisible) {
          this.mapSatellite.$utils.show();
        } else {
          this.mapSatellite.$utils.hide();
        }
      },
      toggleMapTraffic(isVisible) { //切换交通图
        if (isVisible === undefined) {
          this.isShowMapTraffic = !this.isShowMapTraffic;
          isVisible = this.isShowMapTraffic;
        }
        if (!this.mapTraffic) {
          BsjMap.handler("createTraffic",this.map)
        }
        if (isVisible) {
          this.mapTraffic.$utils.show();
        } else {
          this.mapTraffic.$utils.hide();
        }
      },
    },
    watch:{
      mapType(val){
        this.InUtilDosetMapType()
      }
    }
}
</script>
<style lang="less" scoped>
.bsjMap{
  height: 100%;
  width: 100%;
}
.bsjMap-cont{
   height: 100%;
  width: 100%;
  position: relative;
}
/deep/ .bsj-map-label{
      padding: 4px 6px;
    background-color: white;
    // width: auto;
    // border-width: 0;
        // box-shadow: -3px 4px 9px #dedede;
         font-size: 12px;
    line-height: 14px;
        white-space: nowrap;
    cursor: default;
    position: relative;
    top: 0;
    right: 0;
    min-width: 0;
}
/deep/ .amap-wrap  .amap-marker-label{
            border: 0!important;
            background-color: transparent;
        }
</style>
