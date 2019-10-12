<template>
  <div>
      <div class="trackSelect-cont" @click="curSizeStatus = 'small'">
          <el-form class="trackForm" :model="formData" ref="form"   :rules="rules"  size="small"  label-width="80px">
            <el-form-item label="选择车辆" prop="plate" class="noneMargin" v-if="isShowCar">
              <selectVeh  top="-10px" v-model="selectVal" :isShowTree.sync="isShowTree" :inputType="inputType" > </selectVeh>
            </el-form-item>
              <div   class="transitionToggle-box"  :class="[curSizeStatus === 'small'?'':'hide']" >
                <el-form-item class="seep-btns " label="选择时间">
                      <el-button @click.native="doSpeedSelectDate(0)">今天</el-button>
                      <el-button @click.native="doSpeedSelectDate(-1)">昨天</el-button>
                      <el-button @click.native="doSpeedSelectDate(-2)">前天</el-button>
                </el-form-item>
            
                <el-form-item label="开始时间" prop="from">
                  <el-date-picker
                    v-model="formData.from"
                    type="datetime"
                    default-time="00:00:00"
                    :picker-options="pickerOptions"
                    placeholder="请选择开始时间">
                  </el-date-picker>
                  
                </el-form-item>
            
                <el-form-item label="结束时间"  prop="to">
                  <el-date-picker
                    v-model="formData.to"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    default-time="23:59:59"
                    :picker-options="pickerOptions"
                    placeholder="请选择结束时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="静止时间" prop="filterTime">
                  <el-input v-model="formData.filterTime" class="filterTime-input">
                    <template slot="prepend">>=</template>
                    <template slot="append">分钟</template>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item label="停留时间" prop="spaceTime">
                  <el-input v-model="formData.spaceTime" class="filterTime-input">
                    <template slot="prepend">>=</template>
                    <template slot="append">分钟</template>
                  </el-input>
                </el-form-item> -->
                <el-button    :loading="loading" size="medium" class="submit-btn" type="primary" @click="doSearch">查询</el-button>
                <div class="fot-box"  >
                  <div class="col-left" v-popover:functionInfoRef>
                    功能介绍
                  </div>
                  <el-popover
                    ref="functionInfoRef"
                    placement="right-start"
                    popper-class="poperSize-mini"
                    title=""
                    width="440"
                    trigger="hover"
                  >
                    <div class="functionInfo-box">
                        <section class="chunk-box">
                            <div class="c-title">查询规则</div>
                            <div class="c-cont">
                                <p><span class="c-red">有线设备</span>轨迹每次查询区间不能超过31天，轨迹记录默认保存3个月</p>
                                <p><span class="c-red">无线设备</span>轨迹每次查询区间不能超过90天，轨迹记录默认保存1年</p>
                                <p><span class="c-red">静止时间</span>用于筛选静止时间大于或等于所输入值的停留<span class="c-red">轨迹</span></p>
                                <p><span class="c-red">经常停留点</span>查询车辆<span class="c-red">最近一个月内</span>停留时间大于<span class="c-red">30分钟</span>的经常停留点</span></p>
                                <!-- <p><span class="c-red">停留时间</span>用于筛选停留时间大于或等于所输入值的经常<span class="c-red">停留点</span></p> -->
                            </div>
                        </section>
                        <section class="chunk-box">
                            <div class="c-title">特殊设备的里程显示为估算值：</div>
                            <div class="c-cont">
                                <p class="c-red">（注：针对于设备KM-01,KM-02,GT02D,A5E-3）</p>
                                <p>
                该设备不支持里程数据上传，显示里程为<span class="c-red">估算值</span>，仅供参考使用！当发生以下情况，可能会导致里程<span class="c-red">有误差</span>：</p>
                               <p>
                1.当设备处于<span class="c-red">GPS信号弱</span>状态时（例如：停车场或处于GPS信号弱的地方）；
            </p>
                              <p>
                2.当设备处于<span class="c-red">基站定位</span>时；
            </p>
                              <p>
                3.其他可能导致<span class="c-red">定位异常</span>情况；
            </p>
                            </div>
                        </section>
                    </div>
                  </el-popover>
                  <div class="col-right" v-if="mapType" >
                    <span @click="$emit('toggleMapType')"> 切换到{{mapType==="amap" ?"百度":"高德"}}地图<i class="iconfont icon-zuo"></i> </span>
                  </div>
                </div>
            </div>
         </el-form>
        </div>
      
     
      <!-- 放大缩小 -->
      <slot name="footer"></slot>
      <span class="btn_setMini" title="收起"  v-show="curSizeStatus === 'small'" @click="curSizeStatus='mini'">
         <i class="iconfont icon-top"></i>
      </span>
      <el-tooltip class="item" effect="dark" content="展开" placement="right">
        <span class="btn-setSmall"  v-show="curSizeStatus === 'mini'" @click="curSizeStatus='small'" >
            <i class="iconfont icon-fangdajing"></i>
        </span>
      </el-tooltip>
      
  </div>
</template>
<script>
import dayJs from "dayjs"
import selectVeh from "@/components/selectVeh/selectVeh.vue"
export default {
  props:{
    mapType:{
      type:String,
    },
    isShowCar:{
      type:Boolean,
      default:true
    },
    value:{
      type:Object,
      required:1
    },
    loading:{
      type:Boolean,
      default:false
    },
    size:{
      type:String,
      default:"small"
    }
  },
  components:{
    selectVeh
  },
  data(){
    return{
      isShowTree:false,
      curSizeStatus:"small",
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '近七天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      selectVal:{
        plate:this.value.plate,
        vehicleId:this.value.vehicleId,
        _displayLabel:this.value.plate
      },
      inputType: ["vehicle"],
      formData:Object.assign({
        filterTime:Cookies.get("track_filterTime")||0,
        spaceTime:Cookies.get("track_spaceTime")||30,
      }, this.value),
      rules:{
        plate:[
           { validator:this.validatePlate}
        ],
        from:[
          { type: 'date', required: true, message: '请选择开始时间' ,trigger:"blur"},
          { validator:this.validateFrom,trigger:"blur"}
        ],
        to:[
          { type: 'date', required: true, message: '请选择结束时间',trigger:"blur" },
          { validator:this.validateTo,trigger:"blur"}
        ],
        filterTime:[
          { required: true, message: '静止时间不能为空',trigger:"change"},
          { validator:this.validateFilterTime,trigger:"change"}
        ],
        spaceTime:[
          { required: true, message: '停留时间不能为空',trigger:"change"},
          { validator:this.validateSpaceTime,trigger:"change"}
        ]
      }
    }
  },
  methods:{
    doSpeedSelectDate(diffCount=0){ //快速选择时间 今天0 昨天-1 前天-2
      if(!isNaN(diffCount)){
          var toDate=dayJs().subtract(Math.abs(diffCount),"day")
          this.formData.from=toDate.set('hour', 0).set('minute', 0).set('second', 0).toDate()
          this.formData.to=toDate.set('hour', 23).set('minute', 59).set('second', 59).toDate()
      }
      this.$refs["form"].clearValidate(["from","to"])
    },
    validatePlate(rule,value,callback){
      if(this.selectVal&&this.selectVal.vehicleId){
        callback();
      }else{
        callback(new Error("请选择车辆"))
      }
    },
    validateFrom(rule, value, callback){
     
      if(this.formData.to){
        if(dayJs(this.formData.to).isBefore(dayJs(value))){
           callback(new Error("开始时间不能大于结束时间"))
           return 
        }
      }
       this.$refs["form"].clearValidate(["from","to"])
      callback()
      
      
    },
    validateTo(rule, value, callback){
      if(this.formData.from){
        if(dayJs(value).isBefore(dayJs(this.formData.from))){
           callback(new Error("结束时间不能小于开始时间"))
           
           return
        }
      }
      this.$refs["form"].clearValidate(["from","to"])
      callback()
    },
    validateFilterTime(rule,value,callback){
      if(/^[0-9]+$/.test(value)){
        callback()
      }else{
        callback(new Error("静止时间必须为正整数"))
      }
    },
    validateSpaceTime(rule,value,callback){
      if(/^[0-9]+$/.test(value)){
        if(value>0){
          callback()
        }else{
           callback(new Error("停留时间必须为整数且大于0"))
        }
      }else{
        callback(new Error("停留时间必须为整数且大于0"))
      }
    },
    doSearch(){ //查询当前车辆
      this.$refs["form"].validate((valid) => {
          if (valid) {
              this.formData.plate=this.selectVal.plate;
              this.formData.vehicleId=this.selectVal.vehicleId;
              this.$emit("input",Object.assign({},this.formData) )
              this.$emit("doSearch",Object.assign({},this.formData) )
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }

  },
  watch:{
    curSizeStatus(val){
      if(val==="mini"){
        this.isShowTree=false
        this.$refs["form"].clearValidate()
      }else{
        this.$refs["form"].validate();
      }
    }
  }
}
</script>


<style lang="less" scoped>


.trackSelect-cont{
  padding: 10px;
  background-color: #fff;
    box-shadow: -3px 4px 9px #dedede;
}
body, button, input, select, textarea {
    font-family: tahoma,"microsoft yahei","\5FAE\8F6F\96C5\9ED1"!important;
}
.trackForm{
  /deep/ .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus{
         border-color: #f56c6c;
    }
   /deep/ .el-form-item.noneMargin{
      margin-bottom:0
    }
  /deep/ .el-form-item__label{
    font-size: 12px
  }
  /deep/ .el-input--small{
    width: 207px;
    
    .el-input__inner{
      background-color: #F3F4F7;
        border:1px solid transparent;
    }
   
    .el-input-group__append,/deep/ .el-input-group__prepend{
      border:1px solid transparent;
      background-color: #CBCDD4;
      color: #fff;
      padding: 0 10px;
      font-size: 12px;
    }
    
  }
  .seep-btns{
    .el-button{
      border-color:#7EC1F9;
      color:#7EC1F9
    }
    .el-button+.el-button{
          margin-left: 12px;
    }
    .el-button--small, .el-button--small.is-round{
      padding: 8px 16px;
    }
  }
 /deep/ .filterTime-input input{
    text-align: center
  }
  
}
.submit-btn{
    width: 100%;
    display: block;
    background-color: #1184E5;
    &.el-button:focus,&.el-button:hover{
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
   }
}
.fot-box{
  color:#1184E5;
  display: flex;
  padding: 10px 0;
  font-size: 12px;
  font-family: 'PingFang-SC-Medium';
  .col-left{
    cursor:help;
  }
  .col-right{
    cursor: pointer;
    flex: 1;
    text-align: right;
    .iconfont{
      font-size: 12px;
      margin-left:-1px;
    }
  }
}
.select-sec{
  // position: absolute;
  //     left: 100%;
  //   top: 0;
  //   margin-left: 20px;
  // background-color: #fff;
}
.btn_setMini{
    position: absolute;
    bottom: -21px;
    left: 50%;
    /* margin-top: -74px; */
    color: #999;
    background: #fff;
    height: 44px;
    width: 50px;
    margin-left: -25px;
    display: block;
    line-height: 28px;
    border-radius: 50%;
    cursor: pointer;
  &:hover{
    color:#1184e5
  }
  >.iconfont{
    position: absolute;
    font-size: 24px;
    bottom: 4px;
    left: 50%;
    margin-left: -12px;
  }
  // transform: translateY(-50%)
}
.btn-setSmall{
         position: absolute;
    top: 11px;
    color: #fff;
    background: #409EFF;
    line-height: 1;
    width: 45px;
    height: 32px;
    line-height: 31px;
    right: 10px;
    text-align: center;
    cursor: pointer;
   
   
  >.iconfont{
    font-size: 18px;
    font-weight: 600;
  }
}
.transitionToggle-box{
  overflow: hidden;
  transition:all ease 0.5s;
  height:290px;
  padding-top: 18px;
}
.transitionToggle-box.hide{
  // height: 0;
  height: 0;
  opacity:0.1;
  padding-top: 0
}
.functionInfo-box{
  font-size:12px;
  .chunk-box{
    margin-bottom:10px;
    >.c-title{
      margin-bottom: 5px;
      font-weight: 16px;
      font-weight: 600;
    }
    >.c-cont{
      padding-left: 2em;
      >p+p{
        margin-top: 5px;
      }
    }
  }
}

</style>
