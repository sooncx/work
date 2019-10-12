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
        <div class="box2-left">
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
          <div class="box2-2">
            <div class="txtareaTitle">
              <span>备注信息：</span>
            </div>
            <el-input
              class="txtarea"
              type="textarea"
              :rows="4"
              resize="none"
              placeholder="请输入内容"
              v-model="textarea"
            >
            </el-input>
          </div>
        </div>
        <div class="box2-right">
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
            @click="upload(1)"
          >
            <i class="el-icon-plus"></i>
            <p>商业险照片</p>

            <input
              v-show="flase"
              type="file"
              name="avatar"
              id="uppic"
              @change="changeImage($event,1)"
              ref="avatarInput"
              class="uppic"
            >
          </div>
        </div>
      </div>

      <div class="box3">
        <div class="box3-left">
          <div
            class="box3-1"
            v-for="(item,index) in box3"
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
          <div class="box3-2">
            <div class="txtareaTitle">
              <span>备注信息：</span>
            </div>
            <el-input
              class="txtarea"
              type="textarea"
              :rows="4"
              resize="none"
              placeholder="请输入内容"
              v-model="textarea"
            >
            </el-input>
          </div>
        </div>
        <div class="box3-right">
          <div
            class="upshow"
            v-for="(item ,index) in avatar2"
            :key="index"
            @mouseenter="enter2(index)"
            @mouseleave="leave()"
          >
            <div
              @click="del2(index)"
              v-show="index==current2"
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
            v-show="imgFlag2"
            class="upload"
            @click="upload(2)"
          >
            <i class="el-icon-plus"></i>
            <p>商业险照片</p>

            <input
              v-show="flase"
              type="file"
              name="avatar"
              id="uppic"
              @change="changeImage($event,2)"
              ref="avatarInput2"
              class="uppic"
            >
          </div>
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
      current2: null,
      imgFlag2: true,
      imgFlag: true,
      avatar: [],
      avatar2: [],
      hint:
        "注意：为了使您的年审续费信息更加完整，红色项为必填项，其余可后续补充",
      box1: [
        { title: "行驶证到期：", value: null, type: 0 },
        { title: "GPS定位：", value: null, type: 0 },
        { title: "GPS到期：", value: null, type: 0 },
        {
          title: "GPS备注：",
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
          title: "营运证到期：",
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
          title: "营运证到期：",
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
        { title: "北斗到期：", value: null, type: 0 },
        { title: "北斗备注：", value: null, type: 0 },
        { title: "从业资格证到期：", value: null, type: 0 }
      ],
      box2: [
        { title: "交强险到期：", value: null, type: 0 },
        { title: "保险公司：", value: null, type: 0 },
        { title: "交强险费用：", value: null, type: 0 },
        { title: "备注信息：", value: null, type: 0 }
      ],
      box3: [
        { title: "商业险到期：", value: null, type: 0 },
        { title: "保险公司：", value: null, type: 0 },
        { title: "商业险费用：", value: null, type: 0 },
        { title: "保险公司属地：", value: null, type: 0 }
      ]
    };
  },
  methods: {
    upload(type) {
      if (type == 2) {
        this.$refs.avatarInput2.dispatchEvent(new MouseEvent("click"));
      } else this.$refs.avatarInput.dispatchEvent(new MouseEvent("click"));
    },
    del(index) {
      this.avatar.splice(index, 1);
      if (this.avatar.length < 6) {
        this.imgFlag = true;
      }
    },
    del2(index) {
      this.avatar2.splice(index, 1);
      if (this.avatar2.length < 6) {
        this.imgFlag2 = true;
      }
    },
    //上传图片显示缩略图
    changeImage(e, type) {
      var file = e.target.files[0];
      var reader = new FileReader();
      var that = this;
      if (file) {
        reader.readAsDataURL(file);
      }
      reader.onload = function(e) {
        //注意此时this指向
        // console.log("this:" + this);
        // console.log("that:" + that);
        if (this.result.split(":")[1].split("/")[0] == "image") {
          if (type == 2) {
            that.avatar2.push(this.result);
          } else if (type == 1) {
            that.avatar.push(this.result);
          }
        } else {
          that.$message({
            type: "error",
            message: "请选择图片!"
          });
        }
        //console.log(this.result.split(":")[1].split("/")[0]);
      };
      if (that.avatar.length == 5) {
        this.imgFlag = false;
      }
      if (that.avatar2.length == 5) {
        this.imgFlag2 = false;
      }
    },
    enter(index) {
      this.current = index;
    },
    enter2(index) {
      this.current2 = index;
    },
    leave() {
      this.current = null;
      this.current2 = null;
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
    padding: auto, 15px;
    .box1,
    .box2,
    .box3 {
      height: 27%;
      width: 100%;
      border-bottom: 1px solid #eeeeee;
      padding-top: 10px;
    }
    .box2 {
      height: 38%;
      width: 100%;
      display: flex;
    }
    .box2-left,
    .box3-left {
      flex: 6.5;
    }
    .box3 {
      height: 35%;
      width: 100%;
      border-bottom: none;
      display: flex;
    }
    .box3-right,
    .box2-right {
      flex: 3.5;
      display: flex;
      flex-wrap: wrap;
      .upshow {
        margin-right: 16px;
        margin-top: 7px;
        cursor: pointer;
        width: 86px;
        height: 63px;
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
        // i {
        //   cursor: pointer;
        //   position: absolute;
        //   right: 0;
        //   z-index: 999;
        // }
      }
      .upload {
        margin-top: 7px;
        cursor: pointer;
        width: 86px;
        height: 63px;
        border: 1px solid rgba(236, 236, 236, 1);
        position: relative;
        i {
          position: absolute;
          top: 15px;
          left: 50%;
          margin-left: -8px;
        }
        p {
          position: absolute;
          top: 30px;
          left: 12px;
        }
      }
    }

    .box1-1,
    .box2-1,
    .box2-2,
    .box3-1,
    .box3-2 {
      display: inline-block;
      margin: 8px 14px;
    }
    .box1-1:nth-of-type(1),
    .box1-1:nth-of-type(2),
    .box1-1:nth-of-type(5),
    .box1-1:nth-of-type(6),
    .box1-1:nth-of-type(7) {
      color: red;
    }
    .box2-1:nth-of-type(1) {
    }
    .box3-1 {
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
    width: 493px;
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

