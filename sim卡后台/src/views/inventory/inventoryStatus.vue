<template>
  <div
    class="inventory-status"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
  >
    <div class="inven-dropdown-menu">套餐库存状态</div>
    <transition name="slide_top">
      <div
        class="inven-dropdown"
        v-if="visible && indexRunData && indexRunData.comboStock"
      >
        <div
          class="inven-dropdown-item"
          v-for="(val, key) in indexRunData.comboStock"
          :key="key"
        >
          <div>{{ key }}</div>
          <div>已出：<span>{{ val.outOfStock }}</span></div>
          <div>未出：<span>{{ val.inOfStock }}</span></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    indexRunData: null
  },

  watch: {
      indexRunData(val) {
          console.log(val)
      }
  },

  data() {
    return {
      visible: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/base.scss";
.slide_top-enter-active,
.slide_top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.slide_top-enter,
.slide_top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
.inventory-status {
  color: $btnColor !important;
  width: 250px !important;
  flex: none !important;
  position: relative;
  .inven-dropdown-menu {
    cursor: pointer;
  }
  .inven-dropdown {
    position: absolute;
    left: 0;
    top: 28px;
    width: 100%;
    z-index: 10;
    background: #fff;
    padding: 10px 12px 0;
    box-sizing: border-box;
    box-shadow: 0px 4px 6px 0px rgba(154, 154, 154, 0.22);
    .inven-dropdown-item {
      width: 100%;
      height: 34px;
      display: flex;
      align-items: center;
      & > div {
        flex: 2;
        font-size: 14px;
        color: #666 !important;
        span {
          color: $btnColor !important;
        }
      }

      & > div:nth-child(1) {
        flex: 1;
      }
    }
  }
}
</style>

