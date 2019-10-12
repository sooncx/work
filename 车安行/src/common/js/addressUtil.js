import Vue from 'vue'
var defaultErrorResult = {
  regeocode: {
    formatted_address: "获取地址失败",
    isError: true
  }
}


class Address {
  get(lnglatXY) {
    return new Promise((succCall, failCall) => {
      this.checkHasAMap().then(() => {
        if (!this.geocoder) {
          this.geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
        }
        this.geocoder.getAddress(lnglatXY, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            succCall(result.regeocode.formattedAddress);
          } else {
            succCall("获取失败")
          }
        });
      })
    });
  }
  checkHasAMap() {
    console.log("检查")
    return new Promise((succCall, failCall) => {
      if (HasAMap()) {
        succCall();
      } else {
        setTimeout(this.checkHasAMap, 100)
      }
    });
  }
  splistList(list) {

  }
  handlerParams(params) {

  }
  getGeoItem({
    itemParams,
    itemUserCancelToken
  }) {
    if (typeof itemParams.param === "object") {
      itemParams.param = JSON.stringify(itemParams.param)
    }

    return new Vue.prototype.$http({
      url: "http://120.76.69.92:8080/geo/GetGeo.json",
      adapter: "jsonp",
      params: itemParams,
      userCancelToken: itemUserCancelToken,
      isCanNotCancel: true,
      callbackName: "jsoncallback"
    })
  }
  getGeo({
    params,
    userCancelToken
  }) { //批量获取地理位置 每50条拆分一次 
    /*
     *params:{
     *   posList:[{"lat":22.530589,"lon":114.197586,"tag":"1"}]}
     *}
     */

    if (!params || !params.data.posList) {
      console.error("params.posList不能为空")
      return false;
    };
    var posList = params.data.posList
    var maxItemNuber = 50
    var cancelList = [];
    var promiseList = [];
    var promiseCount = Number((posList.length / maxItemNuber).toFixed()) + 1;
    for (var i = 0; i < promiseCount; i++) {
      var itemPosList = posList.slice(maxItemNuber * i, maxItemNuber * (i + 1));
      promiseList.push(this.getGeoItem({
        itemParams: {
          param: {
            posList: itemPosList
          }
        },
        itemUserCancelToken: function (cancel) {
          cancelList[i] = cancel
        }
      }))
    };
    return new Promise((succCall, failCall) => {
      Promise.all(promiseList).then(rstList => {
        //  console.log(rstList);
        var resultList = [];
        for (var i = 0; i < rstList.length; i++) {
          var itemRst = rstList[i];
          if (itemRst.flag === 1 && itemRst.obj) {
            resultList = resultList.concat(itemRst.obj)
          }
        };
        succCall({
          flag: 1,
          obj: resultList
        })
      }).catch(e => {
        failCall(e)
      })
    });
  }
  getGeoProcess({
    params,
    processCall
  }) { // 批量获取地理位置 每50条拆分一次 和 getGeo的区别是50条拆分一次后也会分次返回给外部，用于数据大于1w的时候地址转换过慢的
    if (!params || !params.data.posList) {
      console.error("params.posList不能为空")
      return false;
    };
    var posList = params.data.posList
    var maxItemNuber = 50
    var cancelList = [];
    var promiseCount = Number((posList.length / maxItemNuber).toFixed()) + 1;
    for (var i = 0; i < promiseCount; i++) {
      var itemPosList = posList.slice(maxItemNuber * i, maxItemNuber * (i + 1));
      this.getGeoItem({
        itemParams: {
          param: {
            posList: itemPosList
          }
        },
        itemUserCancelToken: function (cancel) {
          cancelList[i] = cancel
        }
      }).then(rst => {
        processCall(rst)
      })
    };
  }
  formatDisplayRow(itemData) { //格式化显示地址格式
    // itemData={
    //   regeocode:{
    //     "formatted_address":"广东省惠州市惠城区惠环街道和畅八路",
    //     "roads":[
    //       {
    //         "direction": "北",
    //         "distance": 34.8653,
    //         "name": "和畅八路"
    //       }, {
    //         "direction": "东",
    //         "distance": 63.544,
    //         "name": "G25长深高速"
    //       }, {
    //         "direction": "西北",
    //         "distance": 183.025,
    //         "name": "华安路"
    //       }]
    //   }
    // }
    var result = ""
    if (itemData.regeocode) {
      result = itemData.regeocode.formatted_address;
      itemData.regeocode.roads.map((roadItem, roadIndex) => {
        if (roadIndex === 0) {
          result += " (";
        } else {
          result += " ";
        }
        result +=
          "在" +
          roadItem.name +
          "的" +
          roadItem.direction +
          "方向约" +
          Math.floor(roadItem.distance) +
          "米";

        if (roadIndex === itemData.regeocode.roads.length - 1) {
          result += ")";
        }
      });
    } else {
      result = "获取地址失败";
    }
    return result
  }
}
export default new Address();