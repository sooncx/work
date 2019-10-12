<template>
<div>
  <div class="bsj-search-car">
    <input placeholder="车牌号/设备号/SIM号/车主号" class="bsj-search-car-input"  @blur="isSearch" @focus="onSearch" v-model.trim="searchval" />
    <i class="input-icon iconfont icon-fangdajing"></i>
  </div>
  <main>
    <transition name="fade">  
      <div v-show="vehList.length>0&&search==true" class="search-content">
        <div class="hasSearch">
          <ul>
            <li v-for="veh in vehList" @click="queryVehicles(veh)">{{veh.plate}}
              <span>{{searchType[(veh.type-1)]}}</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </main>
</div>
</template>
<script>
// 节流函数
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export default {
  name: "searchCar",
  data() {
    return {
      search: false,
      searchval: "",
      vehList: [],
      searchType: ["车牌号", "终端号", "SIM"]
    };
  },
  components: {},
  created() {},
  mounted() {
    if (localStorage.getItem("vehCache") !== null) {
      this.vehCache = JSON.parse(localStorage.getItem("vehCache"));
    }
  },
  methods: {
    onSearch() {
      this.search = true;
    },
    isSearch() {
      delay(() => {
        this.search = false;
      }, 300);
    },
    searchVehList() {
      this.vehList = [];
      if (this.searchval.trim().length > 1) {
        this.$http({
          url: this.HOST + "/http/Monitor/searchVehicle.json",
          params: {
            serchType: 0,
            plate: this.searchval
          }
        }).then(rst => {
          if (rst.flag === 1) {
            this.vehList = rst.obj;
            this.search = true;
          }
        });
      }
    },
    queryVehicles(veh){
      console.log(veh);
    },
  },
  watch: {
    searchval() {
      delay(() => {
        if (this.searchval != "") {
          this.searchVehList();
        } else {
          this.vehList = [];
        }
      }, 500);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/lessKey";
.bsj-search-car {
  height: 36px;
  position: relative;
  z-index: 888;

  .input-icon {
    position: absolute;
    right: 10px;
    top: 6px;
    color: #999;
  }
}
.bsj-search-car-input {
  position: absolute;
  height: 36px;
  width: 100%;
  padding-right: 20px;
  background: #f1f1f1;
  left: 0;
  top: 0;
  line-height: 36px;
  text-indent: 5px;
}

.search-content {
  position: fixed;
  z-index: 99;
  width: 290px;
  background-color: #fff;
  box-shadow: 0px 5px 5px #f1f1f2;
  .hasSearch {
    height: 100%;
    font-family:'PingFang-SC-Medium', Courier, monospace;
    font-size: 14px;
    font-weight: 500;
  }
  ul {
    overflow: auto;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      color: #333333;
      font-family: PingFang-SC-Medium;
      span {
        color: #4aacff;
      }
    }
    li:hover{
      background-color: #4aacff;
      color: #fff;
      span{
        color: #fff;
      }
    }
  }
}
</style>
