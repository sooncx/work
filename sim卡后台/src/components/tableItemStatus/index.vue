<template>
  <div
    class="status-wrap"
    :style="{'cursor':status === 2 ? 'pointer' : 'default' }"
  >
    <transition name="slide-fade">
      <div
        class="status-loading"
        v-if="status === 1"
      >
        <i class="iconfont icon-sync rotate"></i>
        正在出库
      </div>
    </transition>

    <transition name="slide-fade">
      <div
        class="status-error"
        v-if="status === 2"
        @click="$emit('errorClick')"
      >
        <i class="iconfont icon-gantanhao"></i>
        出库失败
      </div>
    </transition>

    <transition name="slide-fade">
      <div
        class="status-success"
        v-if="status === 3"
      >
        <i class="iconfont icon-zhengque"></i>
        出库成功
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    status: [Number]
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-100px);
  opacity: 0;
}
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.rotate {
  animation: rotate 3s linear infinite; /*开始动画后无限循环，用来控制rotate*/
  display: inline-block;
}
.status-wrap {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    position: absolute;
    width: 100%;
  }
  .status-loading {
    i {
      color: $btnColor;
    }
  }
  .status-error {
    i {
      color: #dd5e5e;
    }
  }
  .status-success {
    i {
      color: #70d675;
    }
  }
}
</style>

