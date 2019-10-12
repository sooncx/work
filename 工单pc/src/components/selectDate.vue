<template>
  <el-date-picker  class="datePicker"
      v-model="value"
      type="datetimerange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="change"
      ref="datePicker"
      :picker-options="pickerOptions">
    </el-date-picker>
</template>
<script>
  export default{
    data(){
      return{
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value: ''
      }
    },
    mounted(){
       
    },
    methods:{
      focus(){
         this.$refs["datePicker"].focus();
      },
      change(val){
        this.$emit("change",this.value)
      }
    }
  }
</script>
<style lang="less" >
.datePicker{
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top:0;
  opacity: 0;
}
</style>
