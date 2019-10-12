<template>
  <span :style="style">{{text}}</span>
</template>

<script>
export default {
  props: {
    orderType: Number,
    sellType: {
      type: Number,
      default: 0
    },
    plain: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    hanlderStyle(color, mode) {
      const colorObj = {
        primary: "#5160d4",
        success: "#1ed76c",
        warning: "#df7323",
        error: "#e73030"
      };
      if (mode === "plain") {
        this.style = {
          border: "none",
          color: colorObj[color]
        };
      } else {
        this.style = {
          borderColor: colorObj[color],
          color: colorObj[color],
          background: "#fff"
        };
      }
    }
  },

  watch: {
    orderType: {
      handler: function(val) {
        if (!val) return;
        if (this.plain) {
          this.hanlderStyle("success", "plain");
          switch (Number(val)) {
            case 1:
              this.text = "卡订单";
              break;
            case 2:
              this.text = "叠加包";
              break;
            case 3:
              this.text = "续费";
              break;
            case 4:
              this.text = "套餐升级";
              break;
          }
        } else {
          this.hanlderStyle("primary");
          switch (Number(val)) {
            case 1:
              this.text = "卡订单";
              break;
            case 2:
              this.text = "叠加包";
              break;
            case 3:
              this.text = "续费";
              break;
            case 4:
              this.text = "套餐升级";
              break;
          }
        }
      },
      immediate: true
    },
    sellType: {
      handler: function(val) {
        if (!val) return;
        if (this.plain) {
          switch (val) {
            case 1:
              this.text = "销售";
              this.hanlderStyle("success", "plain");
              break;
            case 2:
              this.text = "赠送";
              this.hanlderStyle("warning", "plain");
              break;
            case 3:
              this.text = "换卡";
              this.hanlderStyle("error", "plain");
              break;
            case 4:
              this.text = "领用";
              this.hanlderStyle("error", "plain");
              break;
          }
        } else {
          switch (val) {
            case 1:
              this.text = "销售单";
              this.hanlderStyle("success");
              break;
            case 2:
              this.text = "赠送单";
              this.hanlderStyle("warning");
              break;
            case 3:
              this.text = "换卡单";
              this.hanlderStyle("error");
              break;
            case 4:
              this.text = "领用单";
              this.hanlderStyle("error");
              break;
          }
        }
      },
      immediate: true
    }
  },

  data() {
    return {
      text: "",
      style: {}
    };
  }
};
</script>

<style lang="scss" scoped>
span {
  border: 1px solid black;
  padding: 1px 4px;
  user-select: none;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 12px;
  margin-left: 10px;
}
</style>
