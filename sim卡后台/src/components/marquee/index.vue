<template>
    <div class="marquee" ref="marquee">
        <div ref="queebox" class="queebox" :style="{transform:AnimationOpthon}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    time: {
      // 切换间隔时间
      type: Number,
      default: 3000 //ms 毫秒单位
    }
  },
  data() {
    return {
      AnimationOpthon: "translate3d(0px, 0px, 0px)"
    };
  },
  methods: {
      //  当前数量 , 父级的高度, 子级的高度
    handleTime(Num,childH,elH) {
      setTimeout(() => {
        if (Num > childH) {
          Num = 0;
        }
        this.AnimationOpthon = `translate3d(0px, -${Num}px, 0px)`;
        Num += elH;
        this.handleTime(Num,childH,elH)        
      }, this.time);
    }
  },
  mounted() {
    let parentH = this.$refs.marquee.offsetHeight;
    let childH = this.$refs.queebox.offsetHeight;
    let elH = this.$slots.default[0].elm.offsetHeight;
    let Num = elH;
    if (childH > parentH) {
      this.handleTime(Num,childH,elH);
    }
  }
};
</script>


<style lang="scss" scoped>
.marquee {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .queebox {
    transition: transform 300ms ease 0s;
  }
}
</style>


