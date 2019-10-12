<template>
  <div class="monitorCenter-page">
      <div class="col-1">
          <div class="groupTree-box">
              <div class="groupTree-header">
                  <div class="left-title">
                      车组列表
                  </div>
                  <div class="right">
                      <span class="cancelSelectGroup-btn" @click="doCancelSelectGroup">
                         <i class="iconfont icon-allCheck"></i><span class="ver-ali-m">取消选中</span>
                      </span>
                  </div>
              </div>
              <div class="groupTree-cont">
                  <groupTree ref="groupTreeBox" v-model="selectGroupIdList"  @change="changeSelectGroup" class="groupTreeBox">
                    <template>
                    </template>
                  </groupTree>
              </div>
          </div>
          <div class="mon-search-box">
              <searchCar/>
          </div>
          <div class="vhList-box">
              <div class="vhList-tabTitle">
                  <div class="item-title" :class="{active:curCarStatus==='all'}" @click="curCarStatus='all'">
                      <i class="iconfont icon-qubu ver-ali-m"></i>
                      <span class="ver-ali-m">全部({{statusCouts.all}})</span>
                  </div>
                  <div class="item-title" :class="{active:curCarStatus==='online'}" @click="curCarStatus='online'">
                      <i class="iconfont icon-wifi ver-ali-m"></i>
                      <span class="ver-ali-m">在线({{statusCouts.online}})</span>
                  </div>
                  <div class="item-title" :class="{active:curCarStatus==='offline'}" @click="curCarStatus='offline'">
                      <i class="iconfont icon-lixian ver-ali-m"></i>
                      <span class="ver-ali-m">离线({{statusCouts.offline}})</span>
                  </div>
              </div>
              <div class="editSelect-box">
                  <i class="iconfont icon-allCheck"></i> 
                  <span class="ver-ali-m" @click="ckAll()">{{isCkAll}}</span>
              </div>
              <div class="vhList-ulBox">
                  <div class="vhList-ulBoxCont">
                      <happy-scroll size="6" rightcolor="rgba(55, 55, 55, .2)" resize >
                        <ul class="vhList-ul">
                            <monVeh-item :selectVehs="selectedVhListObj" :class="{ active:selectedVhListObj[item.vehicleId]  }" :data="item" :setList="setList" @selectItem="selectedVh" @setOption="setOption"  v-for="(item,index) in displayVehList"></monVeh-item>
                        </ul>
                      </happy-scroll>
                  </div>
                  
              </div>
              <div class="vhList-pagination">
                  <el-pagination
                      small
                      layout="prev, pager, next"
                      :page-size="VehsPageConfig.size"
                      :current-page="VehsPageConfig.page"
                      :total="displayListLen"
                      @current-change="changeVehsPageNumber"
                      >
                    </el-pagination>
              </div>
          </div>
      </div>
      
       
    </div>
  </div>
</template>
<script>
import groupTree from "@/components/groupTree/groupTree";
import searchCar from "@/components/searchCar";
import monVehItem from "@/components/monVehItem";
import eryadian from "@/components/eryadian";
import weizhidian from "@/components/weizhidian";
import churuku from "@/components/churuku";
import monitorCenterMapAll from "@/components/monitorCenterMapAll";
export default {
  data() {
    return {
      avtiveTab: 0,
      selectGroupIdList: [8792], //选择的车组数据
      curCarStatus: "all", //all全部 online在线 offline离线,
      allVehList: [],
      allVehListObj: {},
      onVehList: [],
      offlineVehList: [],
      VehsPageConfig: {
        size: 10,
        page: 1
      },
      selectedVhListObj: {},
      isCkAll:"选中全部",
      mapType: "bdmap",
      showCarVid: null,
      address:"KM-01-3：广东省深圳市龙华区民治大道1094号吉盛楼(在民治大道的西方向约59米)",
      menuList:[
        {
          key:"weixing",
          text:"卫星地图",
          class:"iconfont icon-weixing",
        },
        {
          key:"lukuang",
          text:"路况",
          class:"iconfont icon-lukuang",
        },
        {
          key:"queyuchache",
          text:"区域查车",
          class:"iconfont icon-queyuchache",
        },
        {
          key:"cheju",
          text:"测距",
          class:"iconfont icon-cheju",
        },
        {
          key:"weizhidian",
          text:"位置点",
          class:"iconfont icon-weizhidian",
        },
        {
          key:"weilan",
          text:"围栏",
          class:"iconfont icon-weilan",
        },
        {
          key:"eryadian",
          text:"二押点",
          class:"iconfont icon-eryadian",
        },
        {
          key:"churuku",
          text:"Ocar出入库",
          class:"iconfont icon-churuku",
        },
      ],
      showRightPlanType:"close",
      setList:["查看资料","我要查车","结清","查流量","关注度设置","A5回传设置","超速设置","调度下发","断开油电","恢复油电"],
    };
  },
  components: {
    groupTree,
    searchCar,monVehItem,monitorCenterMapAll,eryadian,weizhidian,churuku
  },
  computed: {
    displayVehList() {
      // if()
      var result = [];
      switch (this.curCarStatus) {
        case "all":
          result = this.allVehList;
          break;
        case "online":
          result = this.onVehList;
          break;
        case "offline":
          result = this.offlineVehList;
          break;
        default:
      }
      var startIndex =
        this.VehsPageConfig.size * (this.VehsPageConfig.page - 1);
      var endIndex = this.VehsPageConfig.size * this.VehsPageConfig.page;
      result = result.slice(startIndex, endIndex);
      return result;
    },
    dispplayAllVehLen() {
      return this.statusCouts[this.curCarStatus];
    },
    statusCouts() {
      return {
        all: this.allVehList.length,
        online: this.onVehList.length,
        offline: this.offlineVehList.length
      };
    },
    displayListLen() {
      return this.statusCouts[this.curCarStatus];
    }
  },
  mounted() {
    if (this.selectGroupIdList.length > 0) {
      this.getVehList();
    }
  },
  methods: {
    changeSelectGroup(params) {
      // debugger
      this.getVehList();
    },
    doCancelSelectGroup() {},
    getVehList() {
      //
      if (this.selectGroupIdList.length > 0) {
        console.log(this.HOST)
        this.$http({
          url: this.HOST + "/http/Monitor/loadVehicles.json",
          params: {
            groupId: this.selectGroupIdList.join(",")
          }
        }).then(rst => {
          if (rst.flag === 1) {
            this.allVehListObj = {};
            this.onVehList = [];
            this.offlineVehList = [];
            rst.obj.data.forEach(item => {
              item = CarDataKeyTrans.toKey(item);
              if (this.isOnline(item)) {
                //在线
                this.onVehList.push(item);
              } else {
                this.offlineVehList.push(item);
              }
              this.allVehListObj[item.vehicleId] = item;
            });
            this.allVehList = rst.obj.data;
          }
        });
      } else {
        //没有选中任何数组的时候
        this.resetVehList();
      }
    },
    isOnline(carData) {
      //判断当前车辆是否在线
      if (carData.z == 1 || carData.z == 2) {
        return true;
      } else {
        return false;
      }
    },
    resetVehList() {
      this.VehsPageConfig.page = 1;
      this.allVehList = [];
      this.allVehListObj = {};
      this.selectedVhListObj = {};
      this.onVehList = [];
      this.offlineVehList = [];
    },
    updateItemCar(carData) {
      //更新单辆车资料
      if (!this.allVehListObj[carData.V]) {
        //如果之前没有当前数据 则要
        this.addItemCar(carData);
      } else {
        carData = CarDataKeyTrans.toKey(carData);
        this.allVehListObj[carData.V] = carData;
      }
    },
    addItemCar(carData) {
      //添加单辆车
      carData = CarDataKeyTrans.toKey(carData);
      if (!this.allVehListObj[carData.vehicleId]) {
        //如果之前没有当前数据 则要更新全部车辆、在线、离线
        this.allVehList.push(carData);
        if (this.isOnline(carData)) {
          //在线
          this.onVehList.push(carData);
        } else {
          this.offlineVehList.push(carData);
        }
      } else {
        this.allVehListObj[carData.V] = carData;
      }
    },
    selectedVh(carData) {
      //车辆列表选中
      var msgStr = null;
      if (carData.Z === 3) {
        msgStr = "该车从未上线";
      } else if (carData.Z === 4) {
        msgStr = "该车已过期";
      } else if (carData.Z === 5) {
        msgStr = "该车未激活";
      }
      if (msgStr) {
        layer.msg(msgStr);
      } else {
        this.$set(this.selectedVhListObj, carData.vehicleId, carData);
        this.showCarVid = carData.vehicleId;
        this.$refs["mapAll"].selectedVh(carData);
      }
    },
    ckAll(){
      this.selectedVhListObj = {};
      if(this.isCkAll=="选中全部"){
        let list=this.displayVehList;
        list.forEach(item => {
          this.$set(this.selectedVhListObj, item.vehicleId, item);
        });
        this.isCkAll="取消选中";
      }else{
        this.isCkAll="选中全部";
      }
    },
    changeVehsPageNumber(val) {
      this.VehsPageConfig.page = val;
      
      if(this.isCkAll=="取消选中"){
        this.selectedVhListObj = {};
        let list=this.displayVehList;
        list.forEach(item => {
          this.$set(this.selectedVhListObj, item.vehicleId, item);
        });
        this.isCkAll="取消选中";
      }
    },
    toolBar(item){
      console.log('工具栏操作:'+item.key);
      
      switch (item.key) {
        case "weixing":
          
          break;
        case "lukuang":
          
          break;
        case "queyuchache":
          
          break;
        case "cheju":
          
          break;
        case "weizhidian":
          this.showRightPlanType=item.key;
          break;
        case "weilan":
          console.log(item.key);
          break;
        case "eryadian":
          this.showRightPlanType=item.key;
          break;
        case "churuku":
          this.showRightPlanType=item.key;
          // 

          break;
        default:
      }
    },
    closeToolBar(){
      this.showRightPlanType="close";
    },
    setOption(item){
      console.log(item);
    }
  },
  watch: {
    curCarStatus(val) {
      this.VehsPageConfig.page = 1;
    }
  }
};
</script>
<style lang="less">
@import "~@/assets/css/style";
@import "~@/assets/css/lessKey";
body {
  background-color: #fff;
}
/* 修改Popover弹出框的优先级 */
.el-popover{
  position: fixed!important;
  min-width: 28px;
}
.monitorCenter-page {
  display: flex;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  flex-direction: row;
  > .col-1 {
    border-right: 1px solid @c-bor;
    width: 310px;
    display: flex;
    flex-direction: column;
    .vhList-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      .vhList-pagination {
        height: 30px;
        text-align: center;
      }
    }
    .vhList-ulBox {
      flex: 1;
      position: relative;
      .vhList-ulBoxCont {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
      }
    }
  }
  .col-2 {
    flex: 1;
    flex-direction: column;
    display: flex;
    
    .address{
      padding:0 8px;
      line-height: 36px;
      font-size: 13px;
      color: #479DE6;
    }
    .mapType-select{
        // height: 20px;
        line-height: 26px;
        border:1px solid #dedede;
        padding: 2px;
        background: #fff;
    }
    .menu-ul{
      display: flex;
      white-space: nowrap;
      margin-right: 10px;
      >li{
        padding: 0 4px;
        white-space: nowrap;
        &+li{
          margin-left:@SPACE_SIZE;
        }
        &:hover {
          color: #fff;
          background-color: #479DE6;
          cursor: pointer;
        }
      }
    }
  }
  .col-2-cont-right {
    width: 250px;
    .pr-10{
      padding-right: 10px;
    }
  }
  .col-2-header {
    height: 36px;
    line-height: 36px;
    display: flex;
    border-bottom: 1px solid @c-bor;
     align-items: center;
     .address-box{
       height: 100%;
       position: relative;
       flex: 1;
       >p{
         color: #2F92E6;
         position: absolute;
         top:0;
         left: 0;
         padding:0 @SPACE_SIZE2;
       }
     }
  }
  .mapType-select{
    margin-right: 8px;
  }
  .col-2-cont {
    flex: 1;
    display: flex;
    >.col-2-cont-left{
      flex:1
    }
  }
  .editSelect-box {
    padding: @SPACE_SIZE2;
    text-align: right;
    cursor: pointer;
    &:hover {
      color: #017ce4;
    }
    .iconfont {
      margin-right: 2px;
    }
  }
}
.mon-search-box {
  padding: 9px;
  border-radius: 2px;
  border-top: 1px solid @c-bor;
}
.groupTree-box {
  height: 350px;
  display: flex;
  flex-direction: column;

  .groupTree-header {
    background-color: #f9f9f9;
    border: 1px solid @c-bor;
    justify-content: center;
    display: flex;
    > .left-title {
      font-weight: 600;
      color: #333;
      font-size: 14px;
      padding: @SPACE_SIZE @SPACE_SIZE2;
    }
    > .right {
      padding: @SPACE_SIZE @SPACE_SIZE2;
      text-align: right;
      flex: 1;
    }
  }
  .groupTree-cont {
    flex: 1;
    position: relative;
    > .groupTreeBox {
      position: absolute;
      left: 0;
      width: 100%;
      top: 0;
    }
  }
}
.cancelSelectGroup-btn {
  cursor: pointer;
  &:hover {
    color: @c-blue;
  }
}
.vhList-tabTitle {
  height: 35px;
  line-height: 35px;
  display: flex;
  > .item-title {
    flex: 1;
    background-color: #f1f1f1;
    color: #a3a3a3;
    text-align: center;
    cursor: pointer;
    &.active,
    &:hover {
      background: #1184e5;
      color: #fff;
    }
  }
}
</style>



