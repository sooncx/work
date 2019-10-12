<template>

  <div
    @click="hideModal"
    class="modal-bg"
    v-show="show"
    @mousemove="modalMove"
    @mouseup="cancelMove"
  >

    <div
      @click.stop
      class="modal-container"
      :class="position"
    >

      <div
        class="modal-header"
        @mousedown="setStartingPoint"
      >
        <i
          class="el-icon-close"
          @click="hideModal"
        ></i>
        {{ title }}
      </div>
      <div class="modal-main">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <el-button
          round
          @click="hideModal"
        >取消</el-button>
        <el-button
          type="primary"
          round
          @click="submit"
        >确认</el-button>
      </div>
    </div>
  </div>

</template>


<script>
export default {
  name: "modal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      x: 0, // 弹窗 X 坐标
      y: 0, // 弹窗 Y 坐标
      node: null, // 弹窗元素
      isCanMove: false // 是否能拖动弹窗
    };
  },
  mounted() {
    // 将弹窗元素赋值给 node
    this.node = document.querySelector(".modal-container");
  },

  methods: {
    setStartingPoint(e) {
      this.x = e.clientX - this.node.offsetLeft;
      this.y = e.clientY - this.node.offsetTop;
      this.isCanMove = true;
    },

    modalMove(e) {
      if (this.isCanMove) {
        this.node.style.left = e.clientX - this.x + "px";
        this.node.style.top = e.clientY - this.y + "px";
      }
    },

    cancelMove() {
      this.isCanMove = false;
    },
    hideModal() {
      this.$emit("hideModal");
    },
    submit() {
      this.$emit("submittoF");
    }
  },

  components: {},
  created() {}
};
</script>

<style lang="less" scoped>
.el-icon-close {
  color: red;
  position: absolute;
  right: 10px;
  top: 5px;
  z-index: 99;
  cursor: pointer;
}
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.modal-container {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal-header {
  height: 56px;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 57px;
  border-top: 1px solid #ddd;
}
.modal-footer button {
  width: 100px;
}
.modal-main {
  padding: 15px 40px;
}
</style>

