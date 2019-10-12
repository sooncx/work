<template>

  <div class="main">
    <Modal
      :show="flag"
      :title="title"
      @hideModal="hideModal"
      @submittoF="submittoS"
    >
      <p>这里放弹窗的内容</p>
    </Modal>
    <div
      class="head"
      v-if="type == 1"
    >
      <el-radio
        v-model="radio"
        label="30"
      >30天</el-radio>
      <el-radio
        v-model="radio"
        label="60"
      >60天</el-radio>
      <span
        class="btn"
        @click="searchList"
      >查询</span>

      <span
        class="btn2"
        @click="exportList2"
      ><i class="el-icon-upload el-icon--right"></i>导出</span>
    </div>

    <div
      class="head"
      v-if="type == 2"
    >
      <div
        v-for="(item,index) in headData"
        :key="index"
      >
        <span class="headData">
          <img
            :src="item.imgurl"
            alt=""
          >
          <span class="nametxt">{{item.name}}</span>
          <span class="valuetxt">{{item.value||"无"}}</span>
        </span>
      </div>
      <span
        class="btn2"
        @click="exportList"
      ><i class="el-icon-upload el-icon--right"></i>导出</span>
    </div>
  </div>
</template>
<script>
import Modal from "../carMenageDialog//dialog";

export default {
  props: {
    type: {
      type: Number
    }
  },
  data() {
    return {
      radio: "30",
      title: "弹窗标题",
      flag: false,
      headData: [
        {
          imgurl: require("@/assets/img/integral/integral1.png"),
          name: "消费积分 :",
          value: "52487"
        },
        {
          imgurl: require("@/assets/img/integral/integral2.png"),
          name: "登录账户 :",
          value: "abc123456"
        },
        {
          imgurl: require("@/assets/img/integral/integral3.png"),
          name: "登录类型 :",
          value: "经销商"
        }
      ]
    };
  },
  methods: {
    searchList() {
      this.$emit("searchFromS", parseInt(this.radio) / 30, 1, 10);
    },
    exportList() {
      this.$emit("exportFromS", parseInt(this.radio) / 30);
    },
    exportList2() {
      this.$emit("exportFromS", 1);
    },
    tirggerFile(event) {
      console.log(event.target.files[0].name);
    },
    show() {
      this.flag = true;
    },

    hideModal() {
      // 取消弹窗回调
      this.flag = false;
    },

    submittoS() {
      // 确认弹窗回调
      this.flag = false;
    }
  },
  components: {
    Modal
  }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
}
.head {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 30px;
  margin: auto;
  margin: 20px auto;
  position: relative;
  .inputBox {
    width: 150px;
  }
  .headData {
    margin-right: 50px;
    font-size: 12px;
  }
  .btn {
    text-align: center;
    width: 60px;
    color: #ffffff;
    cursor: pointer;
    height: 30px;
    background: #0250c1;
    padding: 5px 10px;
    margin-left: 20px;
  }
  .btn2 {
    text-align: center;
    width: 80px;
    color: #ffffff;
    cursor: pointer;
    height: 30px;
    background: #e4e4e4;
    padding: 5px 10px;
    color: #666666;
    position: absolute;
    right: 20px;
  }
}
</style>

