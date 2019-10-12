<template>
    <div class="record_box">
        <nav class="record_left">
            <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                @select="selectItem"
            >
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">出入库</span>
                </el-menu-item>

                <el-menu-item index="2">
                    <i class="el-icon-document"></i>
                    <span slot="title">续费</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">风控设置</span>
                </el-menu-item>
            </el-menu>
        </nav>
        <div class="record_right">
            <component :is="recordCompontns"></component>
        </div>
    </div>
</template>

<script>
import putrecord from './putrecord'
import renew from './renew'
import risk from './risk'
export default {
  data() {
    return {
      recordCompontns:'putrecord'
    };
  },
  methods: {
    selectItem(index) {
        let cm = ['putrecord','renew','risk']
        console.log(cm[index-1])
      this.recordCompontns = cm[index -1]
    }
  },
  components:{
      putrecord,
      renew,
      risk
  }
};
</script>

<style lang="scss" scoped>
.record_box {
  margin: 17px;
  height: calc(100% - 34px);
  display: flex;
  .record_left {
    width: 190px;
    background: #fff;
    height: 100%;
  }
  .record_right {
    //   width: 100%;
    flex: 1;
    box-sizing: border-box;
    margin-left: 20px;
    background: #fff;
  }
}
</style>


