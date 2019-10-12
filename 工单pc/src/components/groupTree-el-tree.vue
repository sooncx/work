<template>
    <div class="groupTree" v-loading="isLoading">
        <el-tree :data="grouTree"   :highlight-current="true"  :check-on-click-node="true" :expand-on-click-node="false"  node-key="gi" :props="treeProps" v-if="!isLoading">
            <template>
                
            </template>
        </el-tree>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
  export default{
    data(){
      return {
        treeProps:{
          children:"children",
          disabled:"disabled",
          icon:"icon",
          label:"gn",
        }
      }
    },
    computed:{
      isLoading(){
          if(this.$store.state.grouTree === null){
            return true
          }else{
            return false
          }
        },
      ...mapGetters({
        grouTree: 'grouTree' 
      })
    }
  }
</script>