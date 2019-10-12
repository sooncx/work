<template>
  <div>
      <el-row class="filter-form">
        <!-- :xs="8" :sm="6" :md="4" :lg="3" :xl="1" -->
         
          <el-col class="filter-form-right" :xs="24" :sm="24" :md="24" :lg="24"  :xl="20"  >
              <filterForm/>
          </el-col>
          <el-col class="filter-form-left" :xs="24" :sm="24" :md="24"  :lg="24" :xl="4" > 
           <el-button type="primary"  size="small">批量短信</el-button>
            <el-button type="primary"  size="small">批量续费</el-button>
             <el-button type="primary"  size="small">风控设置</el-button>
          </el-col>
      </el-row>

  </div>
</template>
<script>
import filterForm from './components/filterForm'
export default {
  name:"Index",
  components:{
    filterForm
  }
}
</script>

