<template>
 <div class="purchase-detail">
     <div class="top-box">
         <span class="back" @click="$emit('Tolink','home')"><i class="iconfont icon-zuo"></i>返回</span>
         <div class="top-page-box">
             <div class="page-left">
             <img src="../../public/img/purchase/purchase.png" />
             <span class="fix-center item-font">{{type.gprsType}}</span>
         </div>
         <div class="page-right">
             <h2>{{type.gprsType}}流量套餐</h2>
             <div class="page-scription">
                <span>说明：</span>
                <span>{{type.remark}}</span>
             </div>
         </div>
         </div>
     </div>
     <div class="footer-box">
           <div class="form-box">
               <div class="form-item">
                   <span class="label">购买数量</span>
                   <input type="text" placeholder="请输入购买数量" maxlength="5" v-model="counts"/>
               </div>
               <div class="form-item">
                   <span class="label">使用年限</span>
                   <el-dropdown placement="bottom-start" @command="handleCommand"  trigger="click">
                    <div class="dropdown-item">
                        {{defualTime}}<i class="el-icon-caret-bottom el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1年">1年</el-dropdown-item>
                        <el-dropdown-item command="2年">2年</el-dropdown-item>
                        <el-dropdown-item command="3年">3年</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
               </div>
               <div class="form-item" style="align-items: baseline;margin-bottom: 50px;">
                   <span class="label">备注信息</span>
                   <textarea placeholder="有什么话要对业务员说" v-model="remark" maxlength="70"></textarea>
               </div>
               <div class="form-btn" @click="showDialog = true">
                   购买
               </div>
           </div>
                   <el-dialog

          class="dilog-box"
          :visible.sync="showDialog"
          width="300px">
                  <div class="dialog-img-box">
        <div class="dialog-img">
        <img :src='require("@/public/img/purchase/purchase.png")'/>
        <span class="fix-center item-font">{{type.gprsType}}</span>
        </div>
         
        </div>
        <div class="dialog-content">
        <span>数量</span>
        <span>{{counts}}张</span>
        </div>
        <div class="dialog-content">
        <span>年限 </span>
        <span>{{defualTime}}</span>
        </div>
        <div class="dialog-content">
        <span>备注</span>
        <span>{{remark}}</span>
        </div>
        <div class="commit-btn" @click="CommitProduct">确认下单</div>
          </el-dialog>
     </div>
 </div>
</template>


<script>
import { message } from "@/util/message";
export default {
  props: ["type"],
  data() {
    return {
      defualTime: "1年",
      count: '100',
      remark: "",
      showDialog: false
    };
  },
  computed: {
    counts: {
      set: function(value) {
        this.count = value;
      },
      get: function() {
        return   this.count.replace(/[^0-9]+/g, "");
      }
    }
  },
  methods: {
    handleCommand(command) {
      this.defualTime = command;
    },
    async CommitProduct() {
      let params = {
        count: this.counts,
        remark: this.remark,
        type: this.type.gprsType,
        orderType:1,
        exYears:this.defualTime.charAt(),
        userCode: this.$store.state.LOGINUSER.userCode
      };
      let data = await this.$API.pushCustomerOrder(params);

      message(data.code, data.msg);
      this.showDialog = false;
      if (data.code === 0) {
        this.$emit("Tolink", "success", data.data);
      }
    }
  }
};
</script>


<style lang="scss">
@import "@/public/css/mixin.scss";
.purchase-detail {
  position: relative;
  height: 100%;
  background: #fff;
  .top-box {
    // height: 40%;
    border-bottom: 1px solid #e6ebf2;
    .top-page-box {
      display: flex;
      .page-left {
        margin: 25px 26px 30px 42px;
        position: relative;
        .item-font {
          color: #fff;
          font-size: 36px;
          top: 40%;
        }
      }
      .page-right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 15px;
        h2 {
          font-size: 20px;
          color: #1c5ed6;
          font-weight: bold;
          margin-bottom: 30px;
        }
        .page-scription {
          display: flex;
          span {
            color: #58616c;
            line-height: 35px;
            &:first-child {
              width: 60px;
            }
            &:last-child {
              width: 70%;
            }
          }
        }
      }
    }

    .back {
      font-size: 14px;
      margin: 10px 12px;
      display: inline-block;
      cursor: pointer;
      color: #58616c;
      i {
        font-size: 13px;
      }
    }
  }
  .footer-box {
    height: 60%;
    .form-box {
      margin-left: 310px;
      margin-top: 40px;
      .form-btn {
        width: 110px;
        height: 40px;
        background: rgba(28, 94, 214, 1);
        border-radius: 2px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      .label {
        color: #58616c;
        font-size: 13px;
        margin-right: 20px;
      }
      .dropdown-item {
        @extend .inputBg;
        color: #bdc6d0;
        line-height: 25px;
      }
      .form-item {
        margin-bottom: 30px;
        display: flex;
        align-items: center;

        textarea {
          resize: none;
          outline: none;
          width: 250px;
          height: 50px;
          //   color: #bdc6d0;
          @extend .inputBg;
        }

        input[type="text"] {
          @extend .inputBg;

          outline: none;
          font-size: #bdc6d0;
          //   font-weight: bold;
        }
      }
    }
  }
}
</style>

