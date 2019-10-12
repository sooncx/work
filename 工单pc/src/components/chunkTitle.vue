<template>
    <div class="p-chunk-title">
        <div class="tbl">
            <div class="tbl-cell left-cell">
                <span class="d_title" v-if="title">{{title}}</span>
                <slot name="title"></slot>
            </div>
            <div class="tbl-cell right-cell">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    props:{
        title:{
            type:String
        }
    }
}
</script>
<style lang="less">
@import "~assets/css/lessKey";
    .p-chunk-title{
        background: #fff;
        padding:0 @SPACE_SIZE2;
        .left-cell{
            vertical-align: middle;
            padding:@SPACE_SIZE2 0;
            border-bottom:1px solid @c-bor;
                white-space: nowrap;
            .d_title{
                text-align: left;
                font-size: 16px;
                font-weight: 600;
                position: relative;
                padding-left:8px;
                overflow: hidden;
                &:before{
                    height:70%;
                    width: 3px;
                    background-color: @c-blue;
                    content: "";
                    position: absolute;
                    transform: translateY(93%);
                    top:-50%;
                    left:0
                }
            }
        }
        .right-cell{
            vertical-align: middle;
           padding:@SPACE_SIZE2 0;
            border-bottom:1px solid @c-bor;
            width: 100%;
            text-align: right;
            
        }
    }
</style>

