<template>
  <div class="faq-wrap">
    <div class="faq-listBox">
      <chunkTitle title="常见问题">
          <div slot="right">
              <search v-model="searchValue" @change="changeSearch" :minWidth="200" placeholder="请输入关键字搜索" />
          </div>
      </chunkTitle>
      <div class="" v-show="curFaqList.length>0">
        <ul class="faq-list">
            <faqItem    v-for="item in curFaqList"  :data="item" />
        </ul>
        <div class="faq-pageWrap">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="faqPagintion.page"
              :page-size="faqPagintion.size"
              layout="total, prev, pager, next"
              :total="faqTotal">
            </el-pagination>
        </div>
      </div>
      <div class="none-faq"  v-show="curFaqList.length === 0">
        暂时没有相关问答
      </div>
    </div>
  </div>
</template>
<script>
  import chunkTitle from 'components/chunkTitle'
  import search from 'components/search'
  import faqItem from './../subComponents/faqItem'
  import faqList from './../json/faq'
  export default{
    data(){
      return{
        searchValue:"",
        displayAllFaqList:faqList,
        faqList:faqList,
        faqPagintion:{
          page:1,
          size:10
        }
      }
    },
    created(){
    },
    computed:{
      faqTotal(){
        return this.displayAllFaqList.length
      },
      curFaqList(){
       var startIndex=this.faqPagintion.size*(this.faqPagintion.page-1);
        var endIndex=this.faqPagintion.size*this.faqPagintion.page;
        return this.displayAllFaqList.slice(startIndex,endIndex)
      }
    },
    components:{
      chunkTitle,
      search,
      faqItem
    },
    methods:{
      changeSearch(val){
        if(val){
          var result=[];
          this.faqList.forEach(item=>{
            if(item.title.indexOf(val)!==-1){
              result.push(item)
            }
          });
          this.displayAllFaqList=result;
        }else{
          this.displayAllFaqList=this.faqList
        }
        this.faqPagintion.page=1
      },
      handleCurrentChange(){

      },
      // getCurFaqList(){
      //     var startIndex=this.faqPagintion.size*(this.faqPagintion.page-1);
      //     var endIndex=this.faqPagintion.size*this.faqPagintion.page;
      //     return this.displayAllFaqList.slice(startIndex,endIndex)
      // }
    }
  }  
</script>
<style lang="less">
@import "~assets/css/lessKey";
.faq-wrap{
  padding:@SPACE_SIZE;
  .none-faq{
    text-align: center;
     padding:@SPACE_SIZE4;
     background: #fff;
  }
}
.faq-listBox{
  ul.faq-list{
    background: #fff;
    
  }
}
.faq-pageWrap{
  text-align: center;
  background: #fff;
  padding-bottom: @SPACE_SIZE2;
}

</style>
