<template>
  <div class="appFull-page simRenew-page">
      <section class="simRenew-header">
          <span class="col-sp">
              <span  class="col-title">总数</span>
              <span  class="col-cont">0</span>
          </span>
          <span class="col-sp">
              <span  class="col-title">正常</span>
              <span  class="col-cont">0</span>
          </span>
          <span class="col-sp">
              <span  class="col-title">过期</span>
              <span  class="col-cont">0</span>
          </span>
          <span class="col-sp">
              <span  class="col-title">销卡</span>
              <span  class="col-cont">0</span>
          </span>
          <span class="col-hr col-sp">
          </span>
          <el-popover class="col-sp" 
            placement="top"
            width="260"
            trigger="hover"
           >
            <p>这是一段内容这是一段内容确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
            </div>
            <span  slot="reference">
                <span  class="col-title">券总数</span>
                <span  class="col-cont">0</span>
            </span>
          </el-popover>
          
          <span class="col-sp">
              <span  class="col-title">200M</span>
              <span  class="col-cont">0</span>
          </span>
           <span class="col-sp">
              <span  class="col-title">200M</span>
              <span  class="col-cont">0</span>
          </span>
           <span class="col-sp">
              <span  class="col-title">200M</span>
              <span  class="col-cont">0</span>
          </span>
      </section>
      <section class="simRenew-tab-nav">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="Index"></el-tab-pane>
          <el-tab-pane label="配置管理" name="HandlerRecord"></el-tab-pane>
          <el-tab-pane label="角色管理" name="third"></el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth"></el-tab-pane>
        </el-tabs>
      </section>
      <section  class="simRenew-cont">
          <router-view class="simRenew-routerView"></router-view>
      </section>
  </div>
</template>
<script>
export default {
  data() {
      return {
        activeName: 'Index'
      };
    },
    created(){
      this.getGroupData();
    },
    methods: {
      getGroupData() {
        //获取车组 在选择车辆store使用 后期转入公用
        this.$api
          .loadGroups({
            concernNeed: true
          })
          .then(rst => {
            if (rst.flag === 1) {
              this.$store.commit("setGroupData", rst.obj.data);
            } else if (rst.msg.indexOf("登录") === -1) {
              setTimeout(() => {
                this.getGroupData();
              }, 2000);
            }
          })
          .catch(e => {
            setTimeout(() => {
              this.getGroupData();
            }, 2000);
          });
      },
      handleClick(tab, event) {
        this.$router.push({
          name:tab.name
        })
      }
    }
}
</script>
<style lang="less" scoped>
.simRenew-page{
  position: relative;
  padding: 10px;
  height: 100%;
  width:100%;
  display: flex;
  flex-direction: column;
}
.simRenew-header{
  background: #fff;
  padding: 10px;
   display: flex;
   >.col-hr{
     padding: 0 0px;
     height: 100%;
     position: relative;
     &::after{
       position: absolute;
       height: 100%;
       width: 1px;
       content: '';
       background-color: #DFE4E9;
     }
   }
  >.col-sp{
    +.col-sp{
      margin-left: 50px;
    }
    .col-title{
      color: #ADAFBD
    }
    .col-cont{
      color: #2187EF
    }
  }
}
.simRenew-tab-nav{
   margin-top: 10px;
   background: #fff;
   /deep/ .el-tabs__content{
       display: none
    }
    /deep/ .el-tabs__header{
    margin:0;
  }
  /deep/ .el-tabs__item{
    padding: 0 40px;
  }
  /deep/ .el-tabs__item.is-top:nth-child(2){
    padding-left:20px!important;
  }
  /deep/  .el-tabs__item.is-top:last-child{
    padding-right: 20px!important;
  }
}
.simRenew-cont{
  flex: 1;
  background: #fff;
  position: relative;
  >.simRenew-routerView{
    position: absolute;
    left: 0;
    top:0;
    height: 100%;
    width: 100%
  }
}
</style>

