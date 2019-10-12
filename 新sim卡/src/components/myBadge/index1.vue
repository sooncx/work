<template>
  <span
    @click="$emit('click')"
    :class="[_type]"
    :style="{'padding-left':hasStatus && '15px', 'color': hasStatus && '#333', 'cursor': hasStatus && 'default'}"
  ><i :class="{'breath': breath}" v-if="hasStatus || type"></i>{{ _text }}</span>
</template>

<script>
export default {
  props: {
    text: [String],
    type: [String],
    orderStatus: [Number], //	订单状态
    simState: [Number], //	SIM卡状态
    outOrIn: [Number], //库存状态
    breath: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    _text() {
      if (this.text !== undefined) {
        return this.text;
      }
      if (this.orderStatus !== undefined) {
        //	0:待处理，1:已出库，2:驳回，3:删除
        switch (this.orderStatus) {
          case 0:
            return "待处理";
          case 1:
            return "已出库";
          case 2:
            return "驳回";
          case 3:
            return "删除";
          case 4:
            return "处理中";
        }
      }
      if (this.simState !== undefined) {
        switch (this.simState) {
          case 0:
            return "正常";
          case 1:
            return "正常";
          case 2:
            return "过期";
          case 3:
            return "销卡";
        }
      }
      if (this.outOrIn !== undefined) {
        switch (this.outOrIn) {
          case 0:
            return "未出库";
          case 1:
            return "出库";
        }
      }
    },
    _type() {
      if (this.type !== undefined) {
        return this.type;
      }
      switch (this._text) {
        case "待处理":
          return "success";
        case "已出库":
          return "success";
        case "驳回":
          return "warning";
        case "删除":
          return "warning";
        case "处理中":
          return "warning";
        case "正常":
          return "success";
        case "过期":
          return "warning";
        case "销卡":
          return "warning";
        case "未出库":
          return "success";
        case "出库":
          return "warning";
      }
    },
    hasStatus() {
      return this.orderStatus || this.orderStatus === 0 || this.simState || this.simState === 0 || this.outOrIn|| this.outOrIn === 0;
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  user-select: none;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  line-height: 1;
  color: #7D8AF0;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  position: relative;
  i{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    display: inline-block;
    width: 7px;
    height: 7px;
    background: #333;
    border-radius: 50%;
  }
}
span.disabled {
  color: #BAC0CB;
  i{
    display: none;
  }
}
span.info {
  i{
    background: #909399;
  }
}
span.warning {
  i{
    background: #FF5D5D;
  }
}
span.primary {
  i{
    background: #145ed9;
  }
}
span.success {
  i{
    background: #70d675;
  }
}
@keyframes breath {
    0% {
        opacity: .5
    }

    70% {
        opacity: 1
    }

    to {
        opacity: .5
    }
}
span {
    i.breath{
      animation: breath 3s infinite ease-in-out alternate;
    }
}
</style>
