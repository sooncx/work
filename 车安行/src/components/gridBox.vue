<template>
  <div class="grid_box border_box">
    <div class="box_head">
      <span class="head_font">{{title}}</span>
      <span
        class="head_btn"
        v-if="btnText"
        @click="submit"
      >{{btnText}}</span>
    </div>
    <div
      class="box_content"
      :style="formatStyle(height)"
    >
      <slot></slot>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    //选中的要下载的名字
    data: {
      type: Array
    },
    title: {
      type: String
    },
    btnText: {
      type: [Boolean, String],
      default: "进入"
    },
    height: {
      type: Number
    }
  },
  methods: {
    formatStyle(height) {
      if (height == 1) {
        return {
          height: 170 + "px"
        };
      } else if (height == 2) {
        return {
          height: 265 + "px"
        };
      } else if (height == 3) {
        return {
          height: 235 + "px"
        };
      }
    },
    submit() {
      this.$emit("dowload");
    }
  }
};
</script>


<style scoped lang="less">
@box_bg: #002457;
.border_box {
  background: @box_bg;
  border: 1px solid #fff;
}
.grid_box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .box_head {
    margin-top: 12px;
    margin-bottom: 16px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    .head_font {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
    .head_btn {
      padding: 3px 9px;
      color: #fff;
      margin-left: auto;
      cursor: pointer;
      background: #1453ba;
      border-radius: 12px;
      text-align: center;
    }
  }
  .box_content {
    overflow: hidden;
  }
  //   .box_content {
  //     overflow-y: scroll;
  //     max-height: 200px;
  //     height: 70%;
  //   }
  //   .box_content::-webkit-scrollbar {
  //     /*滚动条整体样式*/
  //     width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  //     height: 1px;
  //   }

  //   .box_content::-webkit-scrollbar-thumb {
  //     /*滚动条里面小方块*/
  //     border-radius: 10px;
  //     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  //     background: #1255a7;
  //   }
  //   .box_content::-webkit-scrollbar-track {
  //     /*滚动条里面轨道*/
  //     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  //     border-radius: 10px;
  //     background: #002457;
  //   }
}
</style>


