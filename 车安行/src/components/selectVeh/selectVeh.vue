<template>
  <div class="selectVeh">
    <div class="input-box">
      <el-autocomplete
        :size="size"
        class="inline-input"
        v-model="displayInputVal"
        :fetch-suggestions="querySearch"
        :placeholder="placeholder"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
        <template slot-scope="_">
          <div class="autocomplete-slot">
            <template v-if="_.item._type !== 'group'">
              <div class="col-label">
                <p>{{_.item.label}}</p>
              </div>
              <div class="col-right">车辆</div>
            </template>
            <template v-else>
              <div class="col-label">
                <p>{{_.item.gn}}</p>
              </div>
              <div class="col-right">车组</div>
            </template>
          </div>
        </template>
      </el-autocomplete>
      <slot name="after">
        <span class="selectTree" @click.stop="toggleShowTree">
          <i class="iconfont icon-tree mark-tree"></i>
        </span>
      </slot>
    </div>
    <transition name="bsj-zoom-in-left"  @after-enter="showTreeBefor">
      <section class="tree-chunk" :style="{top:top,left:left}" v-show="isShowTree" @click.stop="1==2">
        <div class="tree-cont" :class="[shadow?'shadow':'']">
          <div class="col-group">
            <groupTree
              :isShowConcernNeed="isShowConcernNeed"
              ref="groupTree"
              :groupCheckedValue="defaultSelectedGroupId"
              @currentChange="changeSelectGroup"
              @dbClick="dbClickSelectGroup"
            />
          </div>
          <div class="col-vehList">
            <div class="error-box" v-show="!isVehLoading&&vheList.length===0">
              <div v-if="selectGroupId" class="none-car">
                <i class="icon-gantan iconfont ver-ali-m"></i>
                <span class="ver-ali-m">当前车组未绑定车辆</span>
              </div>
              <div v-else class="step-msg">
                <div class="step-item">
                  <i class="icon-gantan iconfont ver-ali-m"></i>
                  <span class="ver-ali-m">
                    <span class="c-red">单击</span>车组选择对应车组车辆
                  </span>
                  <!-- <span  class="ver-ali-m" v-if="canSelectGroup">，或直接双击选择车组</span> -->
                </div>
                <div class="step-item">
                  <i class="icon-gantan iconfont ver-ali-m"></i>
                  <span class="ver-ali-m">
                    或直接
                    <span class="c-red">双击</span>选择车组
                  </span>
                </div>
              </div>
            </div>
            <div class="veh-loading" v-if="isVehLoading">
              <vehLoader style="width:100%"/>
            </div>
            <scrollPage class="vehList-cont" ref="vehScroll">
              <ul slot="cont" class="veh-ul" v-show="!isVehLoading">
                <li
                  class="car-li"
                  v-for="(item,index) in vheList"
                  :key="index"
                  @click="doSelectVeh(item)"
                  :class="[{'active':selectVehId===item.vehicleId}]"
                >
                  <i class="iconfont icon-che"></i>
                  {{item.plate}}
                </li>
              </ul>
            </scrollPage>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import groupTree from "@/components/groupTree/groupTree";
import scrollPage from "@/components/scrollPage/scrollPage";
import vehLoader from "./vehLoader";
export default {
  props: {
    shadow:{//是否需要阴影
      type:Boolean,
      default:true
    },
    top: { 
      //整个悬浮窗的top位置
      type: String,
      default: "0px"
    },
    size:{
      type:String,
      default:"medium"
    },
    left: {
      //整个悬浮窗的right位置
      type: String,
      default: "100%"
    },
    autoHide: {
      //在选中车辆后是否自动隐藏 默认自动隐藏
      type: Boolean,
      default: true
    },
    inputType: {
      //当前输入框支持输入、选择的类型 ["vehicle","group"]
      type: Array,
      default: function() {
        return ["vehicle"];
      }
    },
    placeholder:{
      type: String,
      default: "请输入车牌号"
    },
    value: {
      default: Object,
      default: function() {
        return null;
      }
    },
    isShowTree:{ //是否显示树状图
       type:Boolean,
       default:false
    }
  },
  components: {
    groupTree,
    scrollPage,
    vehLoader
  },
  data() {
    return {
      // isInited:false, //是否已经初始化完成
      vheList: [],
      isVehLoading: false,
      selectGroupId: null,
      selectedVeh: null, //当前选中的车辆
      selectedGroup: null, //当前选中的车组
      displayInputVal: this.value ? this.value["_displayLabel"] : "",
      curValue: this.value,
      isShowConcernNeed: false, //是否显示重点关注和无线追车组
      defaultSelectedGroupId: "" //默认选中的车组id
    };
  },
  computed: {
    ...mapState(["grouData"]),
    ...mapGetters(["grouTreeData"]),
    transitionNmae() {
      if (this.isShowTree) return "scaleInLeftBig";
      return "scaleInLeftBig";
    },
    selectVehId() {
      return this.selectedVeh ? this.selectedVeh["vehicleId"] : null;
    },
    canDbSelectGroup() {
      //是否可以双击选择车组
      if (this.inputType.indexOf("group") !== -1) {
        return true;
      }
      return false;
    },
    canSelectVehicle() {
      //是否可以选择车辆
      if (this.inputType.indexOf("vehicle") !== -1) {
        return true;
      }
      return false;
    }
  },
  created() {
    if (this.grouTreeData) {
      this.initDefaultSelectedGroupId();
    }
  },
  mounted(){
    document.addEventListener('click', ()=>{
      if(this.isShowTree){
         this.dohideTree()
      }
    })
  },
  methods: {
    initDefaultSelectedGroupId() {
      //设置默认选中第一次车组

      if (!this.defaultSelectedGroupId) {
        for (var j = 0, len = this.grouTreeData.length; j < len; j++) {
          var item = this.grouTreeData[j];
          if (this.isShowConcernNeed) {
            this.defaultSelectedGroupId = item.gi;
            break;
          } else if (item.gi !== -1 && item.gi !== -2) {
            this.defaultSelectedGroupId = item.gi;
            break;
          }
        }
      }
      if(this.defaultSelectedGroupId){
        this.getVehiclesByGroupRds({groupId:this.defaultSelectedGroupId})
        // this.$refs["groupTree"]&&this.$refs["groupTree"].setDefaultGroup(this.defaultSelectedGroupId)
      }
    },
    doEmptyValue() {
      //清空
      this.$set(this, "curValue", null);
      this.$emit("input", null);
      this.emitChange();
    },
    querySearch(queryString, cb) {
      //自动完成输入框事件
      this.doEmptyValue();
      if (queryString.length <= 1) {
        cb([]);
        return;
      }
      var matchGroup = this.canDbSelectGroup
        ? this.getMatchGroup(queryString)
        : [];
      this.$api
        .searchBindingOfVehicles({
          plate: queryString
        })
        .then(rst => {
          if (rst && rst.flag === 1) {
            var result = [];

            rst.obj.map(item => {
              // item.value=
              result.push(
                Object.assign({ label: item.plate, _type: "vehicle" }, item)
              );
            });
            cb(matchGroup.concat(result));
          } else {
            cb(matchGroup);
          }
        })
        .catch(e => {
          console.error(e);
          cb(matchGroup);
        });
    },
    getMatchGroup(str) {
      //根据输入框
      var result = [];
      var maxLen = 10;
      this.grouData.forEach(item => {
        console.log(str);
        if (item.gn.indexOf(str) > -1) {
          result.push(
            Object.assign(
              {
                _type: "group"
              },
              item
            )
          );
          if (result.length >= 10) {
            return;
          }
        }
      });
      return result;
    },
    handleSelect(item) {
      //输入框自动完成选择回调
      if (item["_type"] === "group") {
        if (!this.canDbSelectGroup) {
          console.error("不能选择车组");
        } else {
          this.dbClickSelectGroup(item);
        }
      } else {
        this.doSelectVeh(item);
      }
    },
    changeSelectGroup(itemData) {
      //树状图单击选中车组
      this.selectGroupId = itemData.gi;

      this.selectGroupId &&
        this.getVehiclesByGroupRds({ groupId: this.selectGroupId });
    },
    dbClickSelectGroup(itemData) {
      //双击直接选择车组
      this.selectedGroup = itemData;
      if (this.canDbSelectGroup) {
        this.displayInputVal = itemData.gn;
        this.emitDoSelectedGroup(itemData);
        if (this.autoHide) {
          this.dohideTree()
        }
      } else {
        this.changeSelectGroup(itemData);
      }
    },
    emitDoSelectedGroup(itemData) {
      itemData["_type"] = "group";
      this.$set(this, "curValue", itemData);
      this.$emit("doSelectedGroup", itemData);
      this.$emit("input", itemData);
      this.emitChange();
    },
    getVehiclesByGroupRds({
      //树状图选中车组后获取当前车组
      groupId
    }) {
      this.isVehLoading = true;
      this.vheList=[];
      this.$api
        .getVehiclesByGroupRds(
          { groupId },
          {
            isCanNotCancel: false
          }
        )
        .then(rst => {
          if (rst.flag === 1) {
            this.vheList = rst.obj;
          }
          this.isVehLoading = false;
        })
        .catch(e => {
          this.isVehLoading = false;
          console.error(e);
        });
    },
    showTreeBefor() {
      //显示树状图之前重置宽高
      this.$refs["groupTree"] && this.$refs["groupTree"].reset();
      this.$refs["vehScroll"] && this.$refs["vehScroll"].reset();
    },
    doSelectVeh(veh) {
      //选择车辆
      veh["_type"] = "vehicle";
      this.selectedVeh = veh;
      this.displayInputVal = veh.plate;
      this.$set(this, "curValue", veh);
      this.emitChange();

      this.$emit("doSelectedVeh", veh);
      this.$emit("input", veh);
      if (this.autoHide) {
       this.dohideTree()
      }
    },
    emitChange() {
      this.$emit("change", this.curValue);
    },
    toggleShowTree(){
    
      if(this.isShowTree){
        this.dohideTree()
      }else{
        this.doShowTree();
      }
    },
    dohideTree(){
      
      this.$emit('update:isShowTree', false);
     
    },
    doShowTree(){
       this.$emit('update:isShowTree', true);
     
    }
  },
  watch: {
    grouTreeData: {
      deep: true,
      handler(val) {
        this.initDefaultSelectedGroupId();
      }
    },
    displayInputVal(val,oldval){
      
     if(val===""){
       this.doEmptyValue();
     }
    }
   
  }
};
</script>

<style lang="less" scoped>
.selectVeh {
  .c-red,
  .c-ff0000 {
    color: #ff0000;
  }
  position: relative;
  /deep/ .happy-scroll-container {
    max-width: 100%;
    max-height: 100%;
  }
  .mark-tree {
    color: #1184e5;
    font-size: 20px;
    margin-left: 8px;
    font-weight: 600;
    cursor: pointer;
  }
  .tree-chunk {
    height:392px;
    width: 452px;
    position: absolute;
    z-index: 1000;
    background: #fff;
    display: flex;
    flex-direction: column;
    .header-msg {
      padding: 5px 10px;
    }
    .tree-cont {
     
      &.shadow{
         box-shadow: 5px 4px 9px #dedede;
      }
      padding-left: 10px;

      flex: 1;
      display: flex;
      flex-direction: row;
      font-size: 12px;

      .col-group {
        width: 226px;
        height: 100%;
      }
      .col-vehList {
        box-shadow: 1px 0px 9px #f4f4f4 inset;
        background-color: #f9f9fb;
        height: 100%;
        flex: 1;
        position: relative;
        .veh-ul {
          padding: 10px 0;
        }
        .vehList-cont {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          .car-li {
            line-height: 1.5;
            padding: 0 10px;
            color: #747375;
            cursor: pointer;

            &.active,
            &:hover {
              color: #1184e5;
              .iconfont {
                color: #1184e5;
              }
            }
            .iconfont {
              color: #919caf;
            }
          }
        }
      }
    }
  }
}
.autocomplete-slot {
  display: table;
  table-layout: fixed;
  width: 100%;
  .col-label {
    display: table-cell;
    p {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 12px;
      overflow: hidden;
    }
  }
  .col-right {
    display: table-cell;
    text-align: right;
    width: 40px;
    color: #999;
  }
}
.veh-loading {
  margin-left: 8px;
}
.noneVeh-msg {
  margin-left: 8px;
  margin-top: 8px;
  color: #888;
}
.error-box {
  height: 100%;
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
}
.none-car,
.step-item {
  padding: 5px 16px;
  color: #666;
  background-color: #e9edf1;
}
.step-msg {
  .step-item + .step-item {
    margin-top: 10px;
  }
}
</style>
