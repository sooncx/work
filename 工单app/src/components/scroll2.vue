<template>
  <div
    class="bscroll"
    ref="BScroll"
  >

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

    <slot
      name="pulldown"
      :pullDownStyle="pullDownStyle"
    >
      <div
        class="downwarp"
        :style="pullDownStyle"
        v-if="pullDown"
      >
        <div
          class="before-trigger"
          v-if="beforePullDown"
        >
          <!-- <loading :y="bubbleY"></loading> -->
        </div>
        <div
          class="after-trigger"
          v-else
        >
        <p
          class="upwarp-progress"
          v-if="pullUpLoading === 'loading'"
        ></p>
          <div
            v-else
            class="loadSucess" 
          >
            <img src="@/assets/image/sucess.png" />
            <span>刷新成功</span>
          </div>
        </div>
      </div>

    </slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { throttle } from "@/public/js/plugin/base";
import loading from "./loading";
export default {
  components: {
    BScroll,
    loading
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
    },
    pullDown: {
      type: [Boolean, Object],
      default: false
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
      },
      pullDownInitTop: -50,
      beforePullDown: true,
      isPullingDown: false,
      pullDownStyle: "",
      bubbleY: 0
    };
  },

  methods: {
    async initScroll() {
      await this.$nextTick();
      this.scroll = new BScroll(this.$refs.BScroll, {
        scrollY: true,
        click: true,
        bounce: this.bounce,
        pullDownRefresh: this.pullDown
      });

      if (this.pullUp) {
        //滑动结束松开事件
        this.scroll.on("touchEnd", pos => {
          this.scroll.on("scrollEnd", pos => {
            this.$emit("scrollEnd");
            // 滚动到底部
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {
              //节流
              throttle(() => {
                this.$emit("scrollToEnd");
              }, 60);
            }
          });
        });
      }

      if (this.pullDown) {
        this._initPullDown();
      }
    },
    SuccessPullDown() {
      this.isPullingDown = false;
      setTimeout(() => {
        this.scroll.finishPullDown();
        this.beforePullDown = true;
      }, 1500);
    },
    _initPullDown() {
      this.scroll.on("pullingDown", () => {
        this.beforePullDown = false;
        this.isPullingDown = true;
        this.$emit("pullingDown");
      });
      this.scroll.on("scroll", pos => {
        if (!this.pullDown) {
          return;
        }
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
          this.pullDownStyle = `top:${Math.min(
            pos.y + this.pullDownInitTop,
            15
          )}px`;
        } else {
          this.bubbleY = 0;
        }
      });
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

.downwarp {
  position: absolute;
  padding: 5px 0;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .loadSucess {
    position: relative;
    top:2rem;
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-top: -1px;
    }
    span {
      color: #bfbfbf;
      margin-left: 6px;
      font-size: 11px;
    }
  }
}
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
    font-size: 12px;
    color: gray;
    vertical-align: middle;
    margin-left: 8px;
  }
}
</style>
