<template>
  <div class="config-page">
    <div class="config-page-left">
      <el-scrollbar class="leftMenuScroll" wrap-class="scrollbar-wrapper">
        <el-menu
          size="mini"
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="selectNav"
        >
          <div v-for="(item,index) in navData" :key="index">
            <template v-if="item.children">
              <el-submenu :index="index+''">
                <template slot="title">
                  <span>{{ item.title }}</span>
                </template>
                <template>
                  <el-menu-item v-for="(subItem,subIndex) in item.children" :key="subIndex" :index="subItem.type">{{ subItem.title }}</el-menu-item>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="item.type">{{ item.title }}</el-menu-item>
            </template>
          </div>

        </el-menu>
      </el-scrollbar>
    </div>
    <div class="config-page-right">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="activeType" class="text-item-page" />
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navData: [
        {
          title: '安全配置',
          type: '安全配置'
        },
        {
          title: '服务信息配置',
          children: [
            {
              title: '缓存',
              type: '缓存'
            }, {
              title: '消息队列',
              type: '消息队列'
            }
          ]
        },
        {
          title: '音视频参数设置',
          children: [
            {
              title: '音视频参数',
              type: '音视频参数'
            }, {
              title: '音视频通道列表',
              type: '音视频通道列表'
            }
          ]
        }
      ],
      activeType: ''
    }
  },
  created() {
    this.$router.push({
      name: 'configStandard'
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    selectNav(itemNav) {
      console.log(itemNav)
    }
  }
}
</script>
<style lang="scss" scoped>
.config-page{
  display: flex;
  height: 100%;
  flex-direction: row;
  >.config-page-left{
   width: 220px;
   border-right: solid 1px #e6e6e6;
   .el-menu{
     border-right: none;
   }
  }
  >.config-page-right{
    flex: 1
  }
}
</style>
