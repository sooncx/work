<template>
  <div class="filterForm-box">
        <div class="col">
          <selectVeh size="small" 	:isShowTree.sync="isShowTree"/>
        </div>
        <div class="col">
          <el-date-picker
            size="small"
            v-model="oepnCardDates"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="请选择开卡日期"
            end-placeholder="请选择开卡日期"
            :picker-options="pickerOptions">
          </el-date-picker>
       </div>
       <div class="col">
          <el-date-picker
           size="small"
            v-model="activedDates"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="请选择激活日期"
            end-placeholder="请选择激活日期"
            :picker-options="pickerOptions">
          </el-date-picker>
       </div>
       <div class="col">
         <el-button type="primary"  size="small">查询</el-button>
       </div>
  </div>
</template>
<script>

import selectVeh from '@/components/selectVeh/selectVeh'
export default {
  components:{
    selectVeh
  },
  data() {
    return {
      oepnCardDates:"",
      activedDates:"",
      isShowTree: false,
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
    }
  },
}
</script>
<style lang="less" scoped>
.filterForm-box{
  display: flex;
  >.col{
    &+.col{
      margin-left:20px;
    }
  }
}
</style>


