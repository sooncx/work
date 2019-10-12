
<template>
  <div class="map-wrap">
    <loader-circle v-if="isShowLoading"></loader-circle>
    <div ref="containerMap" class="map" tabindex="0"></div>
    <div class="map-top-icons">
      <map-icon v-for="(item,index) in displayTopIcons" :key="index" :data="item"></map-icon>
      <!-- <div class="item-marker" v-for="(item,index) in displayTopIcons" :key="index" v-if="false">
        <span style="display:none">
          {{doGenStyle(item,index,'top')}}
        </span>
        12
        <i class="iconfont" @click="iconClick(item,index,'top')" :class="[iconStyle['top'][index]]">
        </i>
      </div> -->
    </div>
  </div>
</template>
<script>
import loaderCircle from "@/components/loaderCircle";
import mapIcon from "@/components/mapIcon";
export default {
  props: {
    mapOptions: {
      type: "Object",
      required: 0
    },
    mapIcons: {
      type: [Object, Array],
      required: false
    }
  },
  components: {
    mapIcon,
    loaderCircle
  },
  data: function() {
    return {
      isShowLoading: true,
      geolocation: null,
      map: null,
      currentMapOtions: {
        zoom: 17
      },
      intCheckLoadMap: null,
      mapSatellite: null,
      mapTraffic: null,
      isShowMapTraffic: false,
      isShowMapSatellite: false,
      iconStyle: {
        top: []
      }
    };
  },
  created() {
    this.currentMapOtions = Object.assign(
      {},
      this.currentMapOtions,
      this.mapOptions
    );
    if (window["IS_AMAP_inited"] === "completed") {
      this.createMap();
    } else {
      this.loadJScript();
    }
  },
  computed: {
    displayTopIcons() {
      if (!this.mapIcons) {
        return null;
      } else if (this.isArray(this.mapIcons)) {
        return this.mapIcons;
      } else {
        return this.mapIcons["top"] || null;
      }
    }
  },
  methods: {
    loadJScript() {
      window["gaodeMapInit"] = function() {
        window["IS_AMAP_inited"] = "completed";
      };
      if (!window["IS_AMAP_inited"]) {
        var scriptTep = document.createElement("script");
        scriptTep.type = "text/javascript";
        scriptTep.id = "amapScript";
        scriptTep.getAttribute("status", "loading");
        scriptTep.src =
          "http://webapi.amap.com/maps?tiem=1&v=1.4.4&key=4add2d685eefad99dcd06d2e237b5a7e&callback=gaodeMapInit";
        document.body.appendChild(scriptTep);
        scriptTep.onerror = () => {
          this.$vux.toast.text("map加载失败");
          window["IS_AMAP_inited"] = "error";
        };
        window["IS_AMAP_inited"] = "loading";
      } else if (window["IS_AMAP_inited"] === "error") {
        document.getElementById("amapScript").src =
          "http://webapi.amap.com/maps?tiem=1&v=1.4.4&key=4add2d685eefad99dcd06d2e237b5a7e&callback=gaodeMapInit" +
          "&" +
          new Date().getTime();
      }

      this.intCheckLoadMap = setInterval(() => {
        if (window["IS_AMAP_inited"] === "completed") {
          this.createMap();
          clearInterval(this.intCheckLoadMap);
        }
      }, 100);
    },
    createMap() {
      this.$nextTick(function() {
        if (this.createMapBefore) {
          this.createMapBefore();
        }
        this.map = new AMap.Map(
          this.$refs["containerMap"],
          this.currentMapOtions
        );
        this.isShowLoading = false;
        this.$emit("createdMapAfter", this.map);
        if (this.createdMapAfter) {
          this.createdMapAfter();
        }
      });
    },
    isArray(arr) {
      var toString = Object.prototype.toString;
      var sign = "[object Array]";
      return toString.call(arr) === sign;
  },
    getGeolocation() {
      return new Promise((resolve, reject) => {
        window["getLocation"]()
          .then(rst => {
            this.geolocation = this.formatToMap(rst);
            resolve(this.geolocation);
          })
          .catch(failRst => {
            reject(failRst);
          });
      });
    },
    emitInited() {
      this.$emit("inited", this, map);
    },
    destroyMap() {
      if (this.map) {
        this.map.destroy();
      }
    },
    toggleMapSatellite(isVisible) {
      //切换卫星图
      if (isVisible === undefined) {
        this.isShowMapSatellite = !this.isShowMapSatellite;
        isVisible = this.isShowMapSatellite;
      }
      if (!this.mapSatellite) {
        this.mapSatellite = new AMap.TileLayer.Satellite();
        this.mapSatellite.setMap(this.map);
      }
      if (isVisible) {
        this.mapSatellite.show();
      } else {
        this.mapSatellite.hide();
      }
    },
    toggleMapTraffic(isVisible) {
      
      if (isVisible === undefined) {
        this.isShowMapTraffic = !this.isShowMapTraffic;
        isVisible = this.isShowMapTraffic;
      }
      if (!this.mapTraffic) {
        this.mapTraffic = new AMap.TileLayer.Traffic();
        this.mapTraffic.setMap(this.map);
      }
      if (isVisible) {
        this.mapTraffic.show();
      } else {
        this.mapTraffic.hide();
      }
    },
    correctPostion(lat, lon) {
      //纠偏postion
      var result = CarUtil.correctionGeo(lat, lon);
      return [result.lat, result.lon];
    },
    iconClick(iconData, index, type) {
      if (typeof iconData.callBack === "function") {
        iconData.callBack();
      }
      this.toggleIconImg(iconData, index, type);
    },
    doGenStyle(item, index, type) {
      this.$set(this.iconStyle[type], index, {
        backgroundImage: "url(" + item.icon + ")"
      });
    },
    toggleIconImg(item, index, type) {
      // if (item.icon1 && this.iconStyle[type][index]) {
      //   if (this.iconStyle[type][index]["displayIcon"] === 0) {
      //     this.iconStyle[type][index]["backgroundImage"] =
      //       "url(" + item.icon1 + ")";
      //     this.iconStyle[type][index]["displayIcon"] = 1;
      //   } else {
      //     this.iconStyle[type][index]["backgroundImage"] =
      //       "url(" + item.icon + ")";
      //   }
      // }
    },
    doShowGeolocation(isToCenter = true, callBack) {
      //显示个人定位
      console.log(this.geolocation, "-----1");
      this.getGeolocation().then(rst => {
        if (this.geolocaltionMark) {
          this.map.setCenter(this.geolocation);
        } else {
          this.careateGeolocaltionMark(this.geolocation);
        }
        if (isToCenter) {
          this.map.setCenter(this.geolocation);
        }
        console.log(this.geolocation, "-----");
        if (typeof callBack === "function") {
          callBack(this.geolocation);
        }
      });
    },
    careateGeolocaltionMark(_position) {
      //创建个人定位mark
      //创建我的位置；
      this.geolocaltionMark = new AMap.Marker({
        position: _position,
        icon: new AMap.Icon(GetGeolocationIcon())
      });
      this.geolocaltionMark.setMap(this.map);
      this.geolocaltionMark.setAnimation("AMAP_ANIMATION_DROP");
    },
    formatGeolocation(nativeRst) {
      //格式个人定位信息
      return (this.geolocation = CarUtil.createLanLat({
        lat: nativeRst.data.lat,
        lng: nativeRst.data.lng,
        lon: nativeRst.data.lng
      }));
    },
    formatToMap(data) {
      return CarUtil.createLanLat(data);
    }
  },
  watch: {
    "$store.state.geolocation": {
      handler(val) {
        this.geolocation = CarUtil.createLanLat({
          lat: val.data.lat,
          lng: val.data.lng,
          lon: val.data.lng
        });
        if (this.geolocaltionMark) {
          this.geolocaltionMark.setPosition(this.geolocation);
          this.map.setCenter(this.geolocation);
          this.$emit("changeGeolocation");
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    //销毁前
    this.destroyMap();
  }
};
</script>
<style lang="less">
@import "~assets/css/lessKey";
.loading-gif {
  width: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.map-wrap {
  .amap-logo,
  .amap-copyright {
    opacity: 0;
  }
  position: relative;
  height: 100%;
  width: 100%;
  > .map {
    height: 100%;
  }
  .map-top-icons {
    z-index: 200;
    position: absolute;
    right: 10px;
    top: 20px;
    display: inline-block;
  //   .item-marker:after {
  //     content: "";
  //     display: block;
  //     clear: both;
  //   }
  //   .item-marker + .item-marker {
  //     margin-top: 10px;
  //   }
  //   .map-p-marker,
  //   .item-marker i {
  //     &:active {
  //       transition: all 300ms cubic-bezier(0.1, 0.1, 0.9, 0.9);
  //       transform: scale(1.2);
  //     }
  //     height: 0.6rem;
  //     width: 0.6rem;
  //     min-width: 40px;
  //     min-height: 40px;
  //     max-width: 60px;
  //     max-width: 60px;
  //     display: inline-block;
  //     background-size: cover;
  //     float: left;
  //   }
  }
}
</style>
 