<template>
    <div class="Waves-box">
        <div class="Waves-item" :style="{background:color}"></div>
        <div class="Waves-item" :style="{background:color}"></div>
    </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#E06513"
    }
  },
  data() {
    return {};
  },
  mounted() {
 
  }
};
</script>

<style lang="scss" scoped>
@keyframes waves {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(2.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: .7;
  }
}
.Waves-box {
  width: 10px;
  height: 10px;
  position: absolute;
  .Waves-item {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    &:first-child {
      z-index: 1;
    }
    &:nth-child(2) {
      border-radius: 50%;
      animation: waves 3s linear infinite;
    }
  }
}
</style>


