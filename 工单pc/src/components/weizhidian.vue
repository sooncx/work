  <template>
  <div id="app" class="app-wrap">
    <div class="weiZhiDian_header clr">
      <div class="fl weiZhiDian_font">位置点</div>
      <div class="fr">
        <span  title="添加位置点" class="colorStyle iconfont icon-icon-plus mr-5 pointerStyle" @click="AddPoint()"></span>
        <span  title="查看位置点" class="colorStyle iconfont mr-5 pointerStyle" :class="{'icon-xianshi':isXianshi,'icon-buxianshi':isBuxianshi}" @click="isLookEvent()"></span>
        <!-- <span  title="查看位置点" class="iconfont icon-buxianshi mr-5 pointerStyle"></span> -->
        <span  title="关闭" class="colorStyle iconfont icon-guanbi1 ml-10 pointerStyle" @click="close"></span>
      </div>
    </div>

    <div class="weiZhiDianBox">
      <ul class="clr weiZhiDianStyle mt-10">
        <li class="clr li_paddingStyle" v-for="(item,index) in displayData" :key="index" :class="{liBjActive:index == num}">
          <span class="fl leftContent" :lon="item.oriLon" :lat="item.oriLat"  @click="changeLiBg(index)">{{item.name}}</span>
          <div class="fr rightContent">
            <span title="删除" class="colorStyle iconfont icon-lajitong pointerStyle" @click="delWeiZhiDian(item,index)"></span>
          </div>      
        </li>
      </ul>
    </div>
    <!-- 分页 jumper-->
    <div class="pageFooter">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="this.currentPage"
        :page-size="this.currentPageSize"
        layout="prev, pager, next"
        :pager-count="5"
        :total="this.totalNumber">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isXianshi: true,
      isBuxianshi: false,
      currentWeiZhiDianData: null,
      currentPage: 1,
      currentPageSize: 5,
      totalNumber: 0,
      weiZhiDianTotalData: null,
      num: null
    };
  },
  created() {
    this.getweiZhiDianData();
  },

  computed: {
    displayData() {
      var start =
        this.currentPageSize * this.currentPage - this.currentPageSize;
      var end = this.currentPageSize * this.currentPage;
      var isKong =
        this.weiZhiDianTotalData !== undefined &&
        this.weiZhiDianTotalData !== null &&
        this.weiZhiDianTotalData !== "";
      if (isKong) {
        return this.weiZhiDianTotalData.slice(start, end);
      } else {
        return [];
      }
    }
  },
  methods: {
    changeLiBg(index) {
      this.num = index;
    },
    isLookEvent() {
      if (this.isXianshi) {
        this.isXianshi = false;
        this.isBuxianshi = true;
      } else {
        this.isXianshi = true;
        this.isBuxianshi = false;
      }
    },
    AddPoint() {
      ////添加位置点
      this.$http({
        ///保存api
        url: this.HOST + "/http/SafetyZone/AddPoint.json",
        params: {
          // name:,
          // type:,
          // lon:,
          // lat:,
          // color:
        }
      }).then(rst => {
        if (rst.flag === 1) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        }
      });
    },
    getweiZhiDianData() {
      this.$http({
        url: this.HOST + "/http/SafetyZone/SelectPointByUserId.json"
      }).then(rst => {
        if (rst.flag === 1) {
          this.weiZhiDianTotalData = rst.obj;
          this.totalNumber = rst.obj.length;
          // if(this.totalNumber>0){
          //   this.currentWeiZhiDianData=this.weiZhiDianTotalData.slice(0,this.currentPageSize)
          // }
        }
      });
    },

    delWeiZhiDian(item, index) {
      this.$confirm("是否删除该为位置点?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url:
              this.HOST +
              "/http/SafetyZone/DeletePoint.json?type=" +
              item.type +
              "&id=" +
              item.id
          }).then(rst => {
            if (rst.flag === 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // this.currentWeiZhiDianData.splice(index,1);
              this.weiZhiDianTotalData.splice(index, 1); /////////////////////////////////
              this.totalNumber = this.totalNumber - 1;
            } else {
              this.$message({
                type: "info",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {});
    },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    close(){
      this.$emit("closeToolBar");
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/style";
</style>

<style lang="less" scoped>
@import "~@/assets/css/lessKey";
body {
  background-color: #ffffff;
}
.app-wrap {
  height: 100%;
  position: relative;
}
.weiZhiDian_font {
  color: @c-blue2;
}
.weiZhiDian_header {
  border-bottom: 1px solid #ddd;
  padding: @SPACE_SIZE;
}
.weiZhiDianStyle {
  width: 100%;
  overflow: auto;
}

.weiZhiDianStyle li:nth-child(odd) {
  background: #f9f9f9;
}
.weiZhiDianStyle li span {
  color: #999;
}
.pointerStyle {
  cursor: pointer;
}
.weiZhiDianStyle li:hover {
  background: #f2efef;
}
.pageFooter {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
.weiZhiDianBox {
  max-height: 880px;
  overflow: auto;
}
.colorStyle:hover {
  color: @c-blue2;
}
.li_paddingStyle {
  padding: @SPACE_SIZE;
}
.leftContent {
  display: table-cell;
  width: 90%;
}
.rightContent {
  white-space: nowrap;
}
.liBjActive {
  background: #ddd !important;
}
</style>


