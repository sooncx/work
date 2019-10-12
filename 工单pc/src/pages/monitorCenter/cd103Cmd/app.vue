<template>
  <div class="app-wrap">
    <div class="bsj-layer-tab photo-tab">
      <div class="tab-header">
        <div class="col-left">
          <div class="header-nav">
            <div class="header-nav-item active">指令下发</div>
          </div>
        </div>
        <div class="col-right">
          <div class="closeLayer-btn" @click="doCloseLayer()">
            <i class="iconfont icon-guanbi1"></i>
          </div>
        </div>
      </div>
      <div class="tab-cont" ref="tabCont" v-loading="isShowLoading">
        <section class="tab-contChild">
          <div class="cmd-form">
            <el-form
             
              label-position="right"
              :hide-required-asterisk="false"
              :label-width="lableWidth" class="form-section"
            >
              <el-form-item label="工作模式">
                <el-select class="form-control"  v-model="modelValue" placeholder="请选择">
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template v-if="type==='a7'&&modelValue!==''">
                 <section class="form-section" v-if="modelValue===modelCode.chase">
                  <el-form
                    label-position="right"
                    :hide-required-asterisk="false"
                    :label-width="lableWidth"
                  >
                    <!-- 追车模式 -->
                    <el-form-item label="停车上报周期" prop="stopTime">
                      <el-select
                        class="form-control"
                        v-model="submitInfo[modelCode.chase].stopTime"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in stopCycleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="行驶上报周期" prop="traceInterval">
                      <el-select
                        class="form-control"
                        v-model="submitInfo[modelCode.chase].traceInterval"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in runCycleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </section>
                <section class="form-section" v-if="modelValue===modelCode.safety">
                  <!-- 安全模式 -->
                  <el-form
                      :model="submitInfo[modelCode.safety]"
                    label-position="right"
                    :hide-required-asterisk="false"
                    :label-width="lableWidth"
                  >
                    <el-form-item label="停车上报周期" prop="stopTime">
                      <el-select
                       
                          :rules="rules[modelCode.safety]"
                        class="form-control"
                        v-model="submitInfo[modelCode.safety].stopTime"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in stopCycleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </section>
                <section class="form-section" v-else-if="modelValue === modelCode.saving">
                  <!--省电模式-->
                  <el-form
                    ref="savingForm"
                    :model="submitInfo[modelCode.saving]"
                    :rules="rules[modelCode.saving]"
                    label-position="right"
                    :hide-required-asterisk="true"
                    :label-width="lableWidth"
                  >
                    <el-form-item label="定时回传时间" prop="runTime">
                      <el-select
                        class="form-control"
                        v-model="submitInfo[modelCode.saving].runTime"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in setTimeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="HZ" label="每日定位频率" >
                      <el-input v-model.number="submitInfo[modelCode.saving].HZ">
                        <template slot="append">次</template>
                      </el-input>
                    </el-form-item>
                    <div class="form-row-tips">
                      <p>定时回传时间说明：设置定时回传时间，设备可在下次启动指定时间回传信息。</p>
                      <p>每日定位频率:每日最少定位1次，最多回传288次，回传频率高会缩短设备使用时间，请合理使用。</p> </div>
                  </el-form>
                </section>
            </template>
           <template v-if="type==='a5'&&modelValue!==''">
               <section class="form-section" >
                 <el-form ref="a5SavingForm" :model="a5FormData"  :rules="rules[modelCode.saving]"  label-position="right"
                    :hide-required-asterisk="true"
                    :label-width="lableWidth">
                  <el-form-item label="定时回传时间" prop="runTime">
                      <el-select
                        class="form-control"
                        v-model="a5FormData.runTime"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in setTimeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="HZ" label="每日定位频率" v-if="modelValue !== modelCode.chase">
                      <el-input v-model.number="a5FormData.HZ">
                        <template slot="append">次</template>
                      </el-input>
                    </el-form-item>
                    <div class="form-row-tips">
                      <p>定时回传时间说明：设置定时回传时间，设备可在下次启动指定时间回传信息。</p>
                      <p>每日定位频率:每日最少定位1次，最多回传288次，回传频率高会缩短设备使用时间，请合理使用。</p> </div>
                  </el-form>
               </section>
           </template>
          </div>
        </section>
      </div>
      <div class="fot-handler">
        <div class="btn-box">
          <el-button
            @click.native="doSubmit"
            class="el-button-block"
            type="primary"
            :loading="isSubmitIng"
            :disabled="isShowLoading"
            round
          >发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Loading,Message  } from "element-ui";
/********
 * 
 * A7 1 省电模式 5 安全模式 3 追踪模式
 * 
 * A5 1省电模式 2精准模式 3追车模式 4智能模式

 */
export default {
  data() {
    var noneOption = [
      {
        value: "",
        label: "不设置"
      }
    ];
    var stopCycleOptions = noneOption.concat(
      Array.from(Array(167), (v, k) => {
        //停车上报间隔
        return {
          value: k + 1,
          label: k + 1 + "小时"
        };
      })
    );
    var runCycleOptions = noneOption.concat(
      Array.from(Array(5), (v, k) => {
        //停车上报间隔
        return {
          value: k + 1,
          label: k + 1 + "分钟"
        };
      })
    );
    var setTimeOptions = noneOption.concat(
      Array.from(Array(24), (v, k) => {
        //定时回传时间
        return {
          value: k+":00",
          label: k+""
        };
      })
    );
    var runCycle = []; //行驶上报周期
    var modelCode = {
      saving: 1, //省电
      accurate:2, //精准模式
      ai:4, //只能模式
      chase: 3, //追车
      safety: 5 //安全
    };
    var submitInfo = {};
    submitInfo[modelCode.saving] = {
      //省电模式提交key
      runTime: "",
      HZ: ""
    };
    submitInfo[modelCode.chase] = {
      //追车模式提交key
      stopTime: "",
      traceInterval : ""
    };
    submitInfo[modelCode.safety] = {
      //安全模式提交key
      stopTime: ""
    };
    var rules = {};
    rules[modelCode.saving] = {
      runTime: [],
      HZ: [
        { required: true, message: "每日定位频率不能为空" },
        {
          type: "number",
          message: "只能输入数字"
        },
        {
          type: "number",
          min: 1,
          max: 288,
          message: "每日最少定位1次，最多回传288次"
        }
      ]
    };
    rules[modelCode.safety]={
      stopTime:[{ required: true, message: "请选择停车上报周期" }]
    }
    var a7ModelOptions=[
        {
          value: "",
          label: "不设置"
        },
        {
          value: modelCode.saving,
          label: "省电模式"
        },
        {
          value: modelCode.chase,
          label: "追车模式"
        },
        {
          value: modelCode.safety,
          label: "安全模式"
        }
      ]
    var a5ModelOptions=[
        {
          value: "",
          label: "不设置"
        },
        {
          value: modelCode.saving,
          label: "省电模式"
        },
        {
          value: modelCode.accurate,
          label: "精准模式"
        },
        {
          value: modelCode.chase,
          label: "追车模式"
        },
        {
          value: modelCode.ai,
          label: "智能模式"
        }
      ]
    var type=(getQueryString("type")||"").toLocaleLowerCase();
    var modelOptions=[]
    if(type=== "a5"){
      modelOptions=a5ModelOptions
    }else if(type ==="a7"){
      modelOptions=a7ModelOptions
    }
    return {
      LoadingService: null, //初始化加载动画
      vehicleId: getQueryString("vehId"),
      isShowLoading: true,
      isSubmitIng: false,
      rules: rules,
      modelOptions:modelOptions ,
      setTimeOptions: setTimeOptions,
      stopCycleOptions: stopCycleOptions,
      runCycleOptions: runCycleOptions,
      submitInfo: submitInfo,
      modelCode: modelCode,
      modelValue: "",
      lableWidth: "120px",
      type:type,
      a5FormData:{
        runTime: "",
        HZ: ""
      }
    };
  },
  created() {
    this.init();
    window["w"]=this;
    this.$Message=Message;
  },
  methods: {
    init() {
      this.getSettings();
    },
    openLoadingSerVice() {
      // this.LoadingService=Loading.service({
      //   target:this.$refs["tabContChild"]
      // })
      this.isShowLoading = true;
    },
    colseLoadingSerVice() {
      this.isShowLoading = false;
    },
    getSettings() {
      this.openLoadingSerVice();
      this.$http({
        url:this.HOST+"/http/Increment/GetCmdAInfo.json",
        params:{
          vehicleId:this.vehicleId
        }
      }).then((rst)=>{
        // rst={"flag":1,"obj":{"mode":"3","sleepInterval":"0","traceInterval":"1","interval":"","runTime":""}}
          if(rst.flag===1){
            if(rst.obj.mode){
                this.modelValue=Number(rst.obj.mode)
               switch(this.type){
                 case "a5":
                    this.a5FormData.runTime=rst.obj.runTime
                    this.a5FormData.HZ=rst.obj.interval?this.intervalGetInhz(rst.obj.interval):""
                 break;
                 case "a7": 
                  this.submitInfo[this.modelValue]={
                      // interval:rst.obj.interval||"",
                      stopTime:(rst.obj.sleepInterval&&rst.obj.sleepInterval!=="0")?(Number(rst.obj.sleepInterval)/60):"",
                      runTime: rst.obj.runTime||"",
                      traceInterval :(rst.obj.traceInterval &&rst.obj.traceInterval!=="0")?Number(rst.obj.traceInterval):"",
                      HZ:rst.obj.interval?this.intervalGetInhz(rst.obj.interval):""
                  }
                 break;
               }
               console.log(this.modelValue,this.submitInfo[this.modelValue])
            }
            this.colseLoadingSerVice();
          }else{
             this.confirmReset()
          }
      }).catch((e)=>{
        console.error(e)
        // this.colseLoadingSerVice();
          this.confirmReset()
      })
     
    },
    confirmReset(){
       this.$confirm('网络异常，是否重新获取当前车辆指令设置', '提示', {
          confirmButtonText: '确定',
          cancelButtonText:"取消",
          closeOnClickModal:false,
          showClose:false,
          type: 'warning',
        }).then(() => {
          this.getSettings()
        }).catch(e=>{
           this.doCloseLayer()
        })
    },
    doCloseLayer(state) {
      parent.A5A7CmdSend && parent.A5A7CmdSend.close(state);
    },
    hzGetInterval(HZ){ //根据每日定位频率计算多少分钟回传一次 可能有小数点 向下取整
      if(isNaN(HZ)){
        console.error("HZ必须为数字")
        return ""
      }
      var dayMin=1440 //一天有24x60=1440分钟
      console.log("计算interval",(dayMin/Number(HZ)))
      return Math.floor((dayMin/Number(HZ)))
    },
    intervalGetInhz(interval){//根据interval计算hz 可能有小数点 向上取整
        if(isNaN(interval)){
          console.error("interval必须为数字")
        }
        var dayMin=1440 //一天有24x60=1440分钟
        console.log("hz为="+dayMin/Number(interval))
        return Math.floor((dayMin/Number(interval)))
    },
    checkForm() { 
      //验证表单是否填写正确且获取对应表单内容
      return new Promise((succCall,failCall)=>{
        var result = {
          state: false,
          data: {}
        };
        if(this.modelValue=== ""){ //模式不设置
          result.state=true;
          result.data={
            runTime:"",
            interval:"",
            sleepInterval:"",
            traceInterval:""
          }
          succCall(result);
          return false;
        }
        if(this.type === "a5"){
           this.validateForm("a5SavingForm",(valid)=>{
              result.state=valid
              result.data={
                runTime:this.a5FormData.runTime
              };
              if(this.modelValue === ""){
                result.data={}
              }else if(this.a5FormData.HZ&&this.modelValue!==this.modelCode.chase){ //a5非追车模式有interval间隔时间
                result.data.interval=this.hzGetInterval(this.a5FormData.HZ)
              }
              succCall(result)
          });
        }else if(this.type === "a7"){
             var userInputData = this.submitInfo[this.modelValue]; //用户当前输入的数据
            switch (this.modelValue) {
              case "":
                result.state = true;
                break;
              case this.modelCode.saving: //省电模式
                this.validateForm("savingForm",(valid)=>{
                    result.state=valid
                    result.data={
                      runTime:userInputData.runTime,
                      interval:this.hzGetInterval(userInputData.HZ)
                    };
                    succCall(result)
                });
                break;
              case this.modelCode.chase: //追车模式
                result.state = true;
                result.data={
                  sleepInterval:userInputData.stopTime*60, //停车上报周期
                  traceInterval:userInputData.traceInterval 
                }
                succCall(result)
                break;
              case this.modelCode.safety: //安全模式
                result.state = true;
                result.data={
                  sleepInterval:userInputData.stopTime*60 //停车上报周期
                }
                succCall(result)
                break;
            }
        }
       
      })
    },
    validateForm(formName,callBack) {
      this.$refs[formName]&&this.$refs[formName].validate(callBack);
    },
    resetForm(formName) {
      this.$refs[formName]&&this.$refs[formName].resetFields();
    },
    doSubmit() {
      this.checkForm().then(rst=>{
        if(rst.state){
          rst.data=Object.assign({},{mode:this.modelValue,vehicleId:this.vehicleId},rst.data)
          this.updateSetting(rst.data)
          
        }
      })
    },
    updateSetting(params) {
      if(this.isSubmitIng){
        return false;
      }
      this.isSubmitIng=true
      this.$http({
        url: this.HOST+"/http/Increment/SendCmdA.json",
        params: params
      }).then(rst=>{
        this.isSubmitIng=false;
        if(rst.flag===1){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.doCloseLayer(true)
        }else{
          this.$message({
            message: rst.msg|| "网络异常，请稍后再试",
            type: 'error'
          });
        }
      }).catch(e=>{
        this.$message({
            message: "网络异常，请稍后再试",
            type: 'error'
          });
         this.isSubmitIng=false;
      });
    },
  },
  watch:{
    modelValue(val){
      if(val !== this.modelCode.saving){
        this.resetForm("savingForm")
      }
    }
  }
};
</script>
<style lang="less">
@import "~@/assets/css/style";
body {
  background-color: #ffffff;
}
.app-wrap {
  height: 100%;
}
</style>

<style lang="less" scoped>
@import "~@/assets/css/lessKey";

.photo-tab .col-left {
  display: flex;
}
.header-nav-item {
  font-size: 18px;
}
.header-nav-item.active {
  color: #1184e5;
  font-weight: 600;
}

.tab-cont {
  position: relative;

  .tab-contChild {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    overflow: auto;
    position: absolute;
  }
}
.cmd-form {
  padding: 20px 40px;
}
.form-row {
  display: flex;
  align-items: center;
  & + .form-row,
  & + .form-section {
    margin-top: 10px;
  }
  .form-title {
    width: 120px;
  }
  .form-cont {
    flex: 1;
    > .form-control {
      width: 100%;
    }
  }
}
.is-error .form-title {
  color: #f56c6c;
}
.fot-handler .btn-box {
  padding: 20px;
  width: 50%;
  margin: auto;
}
.form-section .form-row-tips {
  margin-bottom: 10px;
  font-size: 12px;
  color: #999;
}
.form-section{
  .form-control{
    width:100%;
  }
}
.closeLayer-btn{
  color:#666
}
</style>


