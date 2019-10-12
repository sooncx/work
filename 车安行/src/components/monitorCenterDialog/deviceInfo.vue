<template>
  <div class="main">
    <div class="title">{{hint}}</div>
    <div class="box">
      <div class="box1">
        <div
          class="box1-1"
          v-for="(item,index) in box1"
          :key="index"
        >
          <div class="inputTitle">
            <span>{{item.title}}</span>
          </div>
          <el-input
            v-if="item.type == 0"
            class="input"
            size="mini"
            v-model=item.value
            placeholder="请输入内容"
          >
          </el-input>
          <el-select
            v-else
            v-model=item.value
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in item.options"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="box2">
        <div
          class="box2-1"
          v-for="(item,index) in box2"
          :key="index"
        >
          <div class="inputTitle">
            <span>{{item.title}}</span>
          </div>
          <el-input
            v-if="item.type == 0"
            class="input"
            size="mini"
            v-model=item.value
            placeholder="请输入内容"
          >
          </el-input>
          <el-select
            v-else
            v-model=item.value
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in item.options"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="box3">
        <div class="box3-1">
          <div class="inputTitle">
            <span>主车车牌号：</span>
          </div>
          <el-input
            class="input"
            size="mini"
            v-model="input"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div class="box3-2">
          <div class="txtareaTitle">
            <span>备注信息：</span>
          </div>
          <el-input
            class="txtarea"
            type="textarea"
            :rows="2"
            resize="none"
            placeholder="请输入内容"
            v-model="textarea"
          >
          </el-input>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
export default {
  props: {},
  data() {
    return {
      hint:
        "注意：为使您的车辆信息更加完整，红色选项为必填项，其他项可后续补充",
      box1: [
        { title: "主车车牌号：", value: null, type: 0 },
        {
          title: "设备1类型：",
          value: null,
          type: 1,
          options: [
            {
              value: "设备1"
            },
            {
              value: "设备2"
            }
          ]
        },
        {
          title: "设备号：",
          value: null,
          type: 1,
          options: [
            {
              value: "选项1"
            },
            {
              value: "选项2"
            }
          ]
        },
        {
          title: "SIM卡号：",
          value: null,
          type: 1,
          options: [
            {
              value: "选项1"
            },
            {
              value: "43234234234"
            },
            {
              value: "选项3"
            }
          ]
        },
        { title: "所属车组：", value: null, type: 0 },
        { title: "ICCID：", value: null, type: 0 },
        { title: "服务密码：", value: null, type: 0 },
        {
          title: "安装时间：",
          value: null,
          type: 1,
          options: [
            {
              value: "2019-10-21"
            },
            {
              value: "2019-6-13"
            }
          ]
        },
        { title: "安装位置：", value: null, type: 0 },
        { title: "续费年限：", value: null, type: 0 }
      ],
      box2: [
        { title: "到期时间：", value: null, type: 0 },
        { title: "设备2类型：", value: null, type: 0 },
        { title: "设备号：", value: null, type: 0 },
        { title: "SIM卡号：", value: null, type: 0 },
        {
          title: "所属车组：",
          value: null,
          type: 1,
          options: [
            {
              value: "选项1"
            },
            {
              value: "选项2"
            }
          ]
        },
        {
          title: "ICCID：",
          value: null,
          type: 1,
          options: [
            {
              value: "选项1"
            },
            {
              value: "选项2"
            }
          ]
        },
        { title: "服务密码：", value: null, type: 0 },
        { title: "安装时间：", value: null, type: 0 },
        { title: "安装位置：", value: null, type: 0 },
        { title: "续费年限：", value: null, type: 0 }
      ],
      box3: [
        { title: "到期时间：", value: null },
        { title: "备注信息：", value: null }
      ]
    };
  },
  mounted() {},

  methods: {},

  components: {},
  created() {}
};
</script>

<style lang="less" scoped>
/deep/ .el-input,
/deep/ .el-input--mini,
/deep/ .el-input__inner,
/deep/ .el-textarea {
  width: 180px;
  height: 28px;
  font-size: 12px;
  * {
    border-radius: 0 !important;
  }
}
.main {
  width: 98%;
  height: 81%;
  left: 1%;
  top: 90px;
  position: fixed;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;
    background: rgba(238, 245, 255, 1);
    color: #2174eb;
  }
  .box {
    height: 96%;
    background-color: #fff;
    padding-top: 10px;
    .box1,
    .box2,
    .box3 {
      height: 30%;
      width: 100%;
    }
    .box1-1,
    .box2-1,
    .box3-1,
    .box3-2 {
      display: inline-block;
      margin: 8px 14px;
    }
    .box1-1:nth-of-type(1) {
      display: block;
      color: red;
    }
    .box2-1:nth-of-type(1) {
      display: block;
    }
    .box3-1 {
      display: block;
    }
  }

  .inputTitle {
    width: 100px;
    height: 24px;
    display: inline-block;
    span {
      display: flex;
      align-content: flex-end;
      justify-content: flex-end;
    }
  }
  .txtarea {
    width: 500px;
  }
  .txtareaTitle {
    display: inline-block;
    padding-bottom: 10px;
    width: 100px;
    span {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

