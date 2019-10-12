<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div v-show="isShow" class="bsj-error " :class="'bSize-' + size">
      <div class="bsj-error-cont">
        <img-loading class="error-img" :src="imgSrc" alt="" />
        <div class="error-chunk2">
          <div @click="onClickReset">
            {{ msg }}
            <span v-show="hasResetFunction">
              点此<span class="c-blue">重新加载</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import imgLoading from '@/components/imgLoading/imgLoading'
export default {
  name: 'BsjError',
  components: {
    imgLoading
  },
  data() {
    return {
      isShow: false,
      msg: '',
      size: 'small',
      imgSrc: require('./error.png'),
      isAutoSize: true, // 是否自动计算显示size
      hasResetFunction: false // 是否有retry的function 有才显示重新加载
    }
  },
  methods: {
    setMsg(msg) {
      this.msg = msg
    },
    onClickReset() {
      console.log('挖机款进口')
    },
    handleAfterLeave() {
      this.$emit('after-leave')
    },
    computedSize(w, h) {
      // 计算显示大小
      if (!this.isAutoSize) {
        return
      }
      if (typeof w === 'string') {
        w = Number(w.replace('px', ''))
      }
      if (typeof h === 'string') {
        h = Number(h.replace('px', ''))
      }

      if (w < 680 || h < 400) {
        this.size = 'mini'
      } else {
        this.size = 'small'
      }
    },
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    }
  }
}
</script>
<style>
.b-Error-parent--relative {
  position: relative;
}
</style>
<style lang="scss" scoped>
.bsj-error {
  position: absolute;
  z-index: 1900;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
  &.bSize-small {
    .error-img {
      width: 100px;
      height: 100px;
    }
  }
  &.bSize-mini {
    font-size: 12px;
    .error-img {
      width: 60px;
      height: 60px;
    }
  }
  .bsj-error-cont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    text-align: center;
  }
  .error-chunk2 {
    margin-top: 10px;
    cursor: pointer;
  }
}
</style>
