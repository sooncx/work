<template>
  <div class="demo-wrap">
    <section class="header">
      <el-button @click.native="mapType=mapType==='amap'?'bdmap':'amap'">切换地图</el-button>
      <span>{{mapType==='amap' ?"高德地图":"百度地图"}}</span>
    </section>
    <div class="cont">
      <bsjMap :mapType="mapType" @mapInited="mapInited" />
    </div>
  </div>
</template>
<script>
import bsjMap from "@/components/bsjmap/bsjMap.vue";
export default {
  components: {
    bsjMap
  },
  data() {
    return { 
      mapType: "amap",
      map:null,
      carMarker:null
    };
  },
  methods: {
    mapInited(map){
      window["VM"]=this
      this.map=map;
      this.resetMark();
    },
    resetMark(){
      
      this.carMarker=BsjMap.handler("createMarker",{
        map:this.map,
        position:{
          aMap:{
             x:114.3517870685943,
                y:30.384989654327615
          },
          bdMap:{
             x:114.3517870685943,
                y:30.384989654327615
          }
        },
        icon:{
          image:require("@/assets/img/map/alarm.png"),
          size:{w:35,h:35}
        },
        label:{
          labelTxt:"111111111",
          offset:{
            w:20,
            h:38
          }
        }
      })
      BsjMap.handler("setCenter",{
        map:this.map,
        position:{
          aMap:{
             x:114.3517870685943,
                y:30.384989654327615
          },
          bdMap:{
             x:114.3517870685943,
                y:30.384989654327615
          }
        }
      })
      this.carMarker.$bindEvent("click",this.markEvent)
      BsjMap.handler("createInfoWindow",{
        map:this.map,
        path: [
            [116.403322, 39.920255],
            [116.410703, 39.897555],
            [116.402292, 39.892353],
            [116.389846, 39.891365]
        ]
      })
      this.polygon=BsjMap.handler("createPolygon",{
        map:this.map,
        path:[
            [114.3517870685943, 30.384989654327615],
            [116.410703, 39.897555],
            [116.402292, 39.892353],
            [116.389846, 39.891365]
        ]
      })
    },
    markEvent(e){
     BsjMap.handler("hide",{
       marker:this.polygon
     })
      // console.log(e)
        //  this.carMarker.$removeEvent("click",this.markEvent)
        
    }
  }
};
</script>

<style lang="less" scoped >
@import "~@/assets/css/lessKey";
.demo-wrap {
  height: 100%;
  display: flex;

  flex-direction: column;
  .header {
    padding: 10px;
    background-color: #fff;
  }
  .cont {
    flex: 1;
  }
}
</style>



