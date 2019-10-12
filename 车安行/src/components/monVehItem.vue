<template>
  <div class="monVehItem"  :class="statusCls" @click="selectItem"> 
    <div class="col-icon" >
        <i class="iconfont " :class="[ (Number(data.Z)===2)?'icon-tingche':'icon-che']"></i>
    </div>
    <div class="col-plate">
         <p class="p-plate wen-oh">{{data.P}}</p>
    </div>
    <div class="col-leibie">
          <i class="iconfont " :class="[isWifi?'icon-quantity':'icon-youxian']" ></i>
    </div>
    <div class="col-guanzhu">
        <i class="iconfont " v-show="isShowLvIcon" :class="[isShowLvIcon?lvIcon:'']"></i>
    </div>
    <div class="col-status">
        {{statusTxt}}
        <template v-if="data.stateKeepTimeMin">
          ({{data.stateKeepTimeMin}}])
        </template>
    </div>
    <div class="col-config">
      <el-popover placement="right-start" trigger="click">
        <i slot="reference" class="el-button option iconfont icon-shezhi2"></i>
        <ul class="option-ul">
          <li v-for="item in setList" @click="setOption(item)">
            <span>{{item}}</span>
          </li>
        </ul>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: 1
    },
    setList: {
      type: Array,
      default: ["查看资料", "我要查车"]
    }
  },
  data() {
    return {
      statusTxt: "",
      visible: false
    };
  },
  computed: {
    statusCls() {
      var cls = "";
      switch (this.data.Z) {
        case 0: //离线
          cls = "offline";
          this.statusTxt = "离线";
          break;
        case 1: //在线
          cls = "run";
          this.statusTxt = "行驶";
          break;
        case 2: //停车
          cls = "park";
          this.statusTxt = "停车";
          break;
        case 3: //从未上线
          cls = "NeverOnline";
          this.statusTxt = "从未上线";
          break;
        case 4: //过期
          cls = "expire";
          this.statusTxt = "过期";
          break;
        case 5: //未激活
          cls = "nonactivated";
          this.statusTxt = "未激活";
          break;
      }
      if (this.timeInterval) {
        this.statusTxt = "回传";
      }
      if (this.data.alarm) {
        cls = "alarm";
      }
      return cls;
    },
    isWifi() {
      //是否是无线设备 longStayTer == 0 //无线：1，有线：0
      if (this.longStayTer === 0) {
        return true;
      } else {
        return false;
      }
    },
    isShowLvIcon() {
      if (this.data.CL) {
        return true;
      } else {
        return false;
      }
    },
    lvIcon() {
      switch (this.data.CL) {
        case 1:
          return "icon-gao";
          break;
        case 2:
          return "icon-zhong";
          break;
        case 3:
          return "icon-di";
          break;
      }
    }
  },
  methods: {
    selectItem() {
      this.$emit("selectItem", this.data);
    },
    setOption(item) {
      this.$emit("setOption", item);
      document.querySelector('option').click();
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/style";
@import "~@/assets/css/lessKey";
.monVehItem {
  display: flex;
  padding: 5px @SPACE_SIZE2;
  align-items: center;
  &.active,
  &:hover {
    background-color: rgb(188, 221, 249);
    cursor: pointer;
  }
  &.park {
    .col-icon,
    .col-plate {
      color: #1184e5;
    }
  }
  &.alarm {
    .col-icon,
    .col-plate,
    .col-status {
      color: #cf1a1a;
    }
  }
  .col-icon {
    margin-right: @SPACE_SIZE;
    color: #2b3346;
    .iconfont {
      font-size: 18px;
    }
  }
  .col-plate {
    flex: 1;
    position: relative;
    color: #333;
    > .p-plate {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      // height: 100%;
      height: 26px;
      line-height: 26px;
      // width: 100%;
      // word-wrap: normal
    }
  }
  .col-leibie {
    color: #017ce4;
  }
  .col-guanzhu {
    .iconfont {
      font-size: 18px;
    }
  }
  .col-status {
    width: 80px;
  }
  .col-plate,
  .col-guanzhu {
    margin-right: @SPACE_SIZE;
  }
  .col-leibie,
  .col-guanzhu {
    width: 20px;
    text-align: center;
  }
  .col-config {
    .iconfont {
      font-size: 14px;
    }
    color: #999;
    cursor: pointer;
    &:hover {
      color: #017ce4;
    }
    .el-button{
      border: 0px;
      background: transparent;
    }
  }
}
/* 修改Popover弹出框的优先级 */
.el-popover{
  position: fixed!important;
  min-width: 28px;
}
.option-ul {
  > li {
    &:hover {
      color: #fff;
      background-color: #B2D2FF;
      cursor: pointer;
    }
  }
}
</style>


