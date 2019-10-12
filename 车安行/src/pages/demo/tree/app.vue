<template>
  <div>
	  <el-row>
		  	<el-col :span="20">
	  <el-input placeholder="请输入用户id查看对应车组" label="用户id" v-model="userId">
		   <template slot="prepend">用户id</template>
	  </el-input>
		  	</el-col>
			  <el-col :span="4">
	   			<el-button type="primary" :loading="isGetApiing"  @click.native="getData">搜索</el-button>
				   </el-col>
	  </el-row>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText">
		<template slot="prepend">关键词过滤</template>
	</el-input>
    <el-tree
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
      ref="tree"
      :filter-node-method="filterNode"
    ></el-tree>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "groupName"
      },
	  data: [],
	  userId:2,
	  isGetApiing:false
    };
  },
  created(){
	  this.getData();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.groupName.indexOf(value) !== -1;
    },
	handleNodeClick() {},
	getData(){
		this.data=[]
		this.isGetApiing=true
		this.$http({
			url:this.demoapi+"/login/Notice/CountGroup.json",
			params:{
				userId:this.userId
			}
		}).then(rst=>{
		
			if(rst.flag===1){
				this.data=rst.obj
			}else{
				this.$message(rst.msg)
				console.error(rst.msg)
			}
			this.isGetApiing=false
		}).catch(e=>{
			this.$message("未知错误，请稍后再试")
			this.isGetApiing=false
			console.error(e)
		})
	}
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
	},
	
  }
};
</script>
