<template>
    <li class="faq-item" @click="toggleDetails" :class="{'active':isShowCentent}">
        <div class="item-title"><p class=" wen-oh">{{data.title}}</p></div>
        <div class="item-cont"  >
            <div v-html="data.content" ></div>
        </div>
    </li>
</template>
<script>
  export default{
     props:{
       data:{
          type:Object,
          required:true
       }
     },
     data(){
       return{
         isShowCentent:false
       }
     },
     methods:{
       toggleDetails(){
         this.isShowCentent=!this.isShowCentent;
       }
     }
     
  }
</script>
<style lang="less">
@import "~assets/css/lessKey";
  .faq-item{
    &:last-child{
      padding-bottom: @SPACE_SIZE2;
        .item-title{border-bottom: none;}
    }
    &.active{
      .item-title{color: @c-blue2;}
       .item-cont{
         transform:scale(1);
         height: auto;
         padding:0 @SPACE_SIZE2 @SPACE_SIZE2 @SPACE_SIZE2;
       }
    } 
    .item-title
    {
      margin:0 @SPACE_SIZE2 ;
      padding: @SPACE_SIZE2;
      font-size: 14px;
      border-bottom:1px solid @c-bor;cursor: pointer;
      &:hover{
        color: @c-blue2;
      }
    }
    
    .item-cont{
      height: 0;
      
      background: #fff;
      transition:  all 200ms cubic-bezier(0.19, 1, 0.22, 1);
      transform: scale(1,0);
      transform-origin: 0% 0%;
      >div{
         padding:@SPACE_SIZE2;
        background: @c-body;
      }
    }
    
  }
  
</style>
