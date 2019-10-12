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
        <div class="box2-1">
          <div
            class="upshow"
            v-for="(item ,index) in avatar"
            :key="index"
            @mouseenter="enter(index)"
            @mouseleave="leave()"
          >
            <!-- <i
              @click="del2(index)"
              class="el-icon-close"
              id="delimg"
            ></i> -->
            <div
              @click="del(index)"
              v-show="index==current"
              class="imgcover"
            >
              点击删除图片
            </div>
            <img
              :src="item"
              class="img-avatar"
            >
          </div>
          <div
            v-show="imgFlag"
            class="upload"
            @click="upload()"
          >
            <i class="el-icon-plus"></i>
            <p>商业险照片</p>

            <input
              v-show="flase"
              type="file"
              name="avatar"
              id="uppic"
              @change="changeImage($event)"
              ref="avatarInput"
              class="uppic"
            >
          </div>
        </div>
        <div class="box2-2">
          <div class="txtareaTitle">
            <span>备注信息：</span>
          </div>
          <el-input
            class="txtarea"
            type="textarea"
            :rows="3"
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
      current: null,
      imgFlag: true,
      avatar: [],
      hint:
        "注意：为使您的车辆信息更加完整，红色选项为必填项，其他项可后续补充",
      box1: [
        { title: "所属公司：", value: null, type: 0 },
        { title: "车牌号码：", value: null, type: 0 },
        {
          title: "车辆种类：",
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
          title: "车辆类型：",
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
          title: "车辆品牌：",
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
        { title: "车身颜色：", value: null, type: 0 },
        { title: "车辆型号：", value: null, type: 0 },
        { title: "车辆型号：", value: null, type: 0 },
        { title: "车辆识别代号：", value: null, type: 0 },
        { title: "发动机号码：", value: null, type: 0 },
        { title: "牵引总质量(kg)：", value: null, type: 0 },
        { title: "货箱尺寸：", value: null, type: 0 },
        { title: "轴数：", value: null, type: 0 },
        { title: "总质量(kg)：", value: null, type: 0 },
        { title: "核定载质量(kg)：", value: null, type: 0 },
        { title: "整备质量：", value: null, type: 0 },
        { title: "等级证书编号：", value: null, type: 0 },
        {
          title: "注册日期：",
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
        {
          title: "发证日期：",
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
        { title: "计息方式：", value: null, type: 0 },
        { title: "还款方式：", value: null, type: 0 },
        { title: "计息利率：", value: null, type: 0 }
      ]
    };
  },
  methods: {
    upload() {
      this.$refs.avatarInput.dispatchEvent(new MouseEvent("click"));
    },
    del(index) {
      this.avatar.splice(index, 1);
      if (this.avatar.length < 5) {
        this.imgFlag = true;
      }
    },
    //上传图片显示缩略图
    changeImage(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      var that = this;
      if (file) {
        reader.readAsDataURL(file);
      }
      reader.onload = function(e) {
        if (this.result.split(":")[1].split("/")[0] == "image") {
          that.avatar.push(this.result);
        } else {
          that.$message({
            type: "error",
            message: "请选择图片!"
          });
        }
      };
      if (that.avatar.length == 4) {
        this.imgFlag = false;
      }
    },
    enter(index) {
      this.current = index;
    },

    leave() {
      this.current = null;
    }
  },
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
    .box1 {
      height: 65%;
      width: 100%;
      border-bottom: 1px solid #eeeeee;
    }
    .box2 {
      height: 35%;
      width: 100%;
      margin: 8px 14px;
    }
    .box1-1 {
      display: inline-block;
      margin: 8px 14px;
    }
    .box2-1 {
      margin: 10px 103px;
      padding-bottom: 5px;
      display: flex;
      flex-wrap: wrap;
      .upshow {
        margin-right: 35px;
        margin-top: 7px;
        cursor: pointer;
        width: 116px;
        height: 85px;
        border: 1px solid rgba(236, 236, 236, 1);
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .imgcover {
          position: absolute;
          z-index: 999;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.335);
        }
      }
      .upload {
        margin-top: 7px;
        margin-right: 40px;
        cursor: pointer;
        width: 116px;
        height: 85px;
        border: 1px solid rgba(236, 236, 236, 1);
        position: relative;
        i {
          position: absolute;
          top: 25px;
          left: 50%;
          margin-left: -8px;
        }
        p {
          position: absolute;
          top: 40px;
          left: 25px;
        }
      }
    }
    .box1-1:nth-of-type(1),
    .box1-1:nth-of-type(2) {
      color: red;
    }
    .box1-1:nth-of-type(2) {
      margin-right: 100px;
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

