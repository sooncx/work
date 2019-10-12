<template>
  <div class="bscroll" ref="BScroll">
    <div>
      <div>
        <slot></slot>
      </div>
      <!-- 底部提示信息 -->
      <div
        v-if="pullUp && pullUpLoading !==''"
        class="upwarp"
      >
        <p
          class="upwarp-progress"
          v-if="pullUpLoading === 'loading'"
        ></p>
        <p class="upwarp-tip">{{ pullupMsg[pullUpLoading] }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { throttle } from "@/public/js/plugin/base";
export default {
  components: {
    BScroll
  },

  props: {
    bounce: {
      type: Boolean,
      default: true
    },
    pullUp: {
      type: Boolean,
      default: false
    },
    pullUpLoading: {
      type: String,
      default: "" //start loading end
    }
  },

  mounted() {
    this.initScroll();
  },

  data() {
    return {
      scroll: null,
      pullupMsg: {
        start: "加载更多",
        loading: "加载中..",
        end: "已无更多数据"
      }
    };
  },

  methods: {
    async initScroll() {
      await this.$nextTick();
      this.scroll = new BScroll(this.$refs.BScroll, {
        scrollY: true,
        click: true,
        bounce: true
      });

      if (this.pullUp) {
        //滑动结束松开事件
        this.scroll.on("touchEnd", pos => {
          this.scroll.on("scrollEnd", pos => {
              this.$emit("scrollEnd");
           
            // 滚动到底部
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {
              // this.$emit("scrollToEnd");
              throttle(() => {
                this.$emit("scrollToEnd");
              }, 60);
            }
          });
        });
      }
    },
    async refresh() {
      await this.$nextTick(() => {});
      this.scroll.refresh();
    }
  }
};
</script>

<style lang="less" scoped>
.bscroll {
  height: 100%;
  overflow: hidden;
}
/* 拉提示信息 */
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.upwarp {
  min-height: 30px;
  text-align: center;
  display: block;
  visibility: visible;
  .upwarp-progress {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid gray;
    border-bottom-color: transparent;
    vertical-align: middle;
    animation: rotate 0.6s linear infinite;
  }
  .upwarp-tip {
    display: inline-block;
    font-size: 0.2rem;
    color: gray;
    vertical-align: middle;
    margin-left: 8px;
  }
}
</style>
