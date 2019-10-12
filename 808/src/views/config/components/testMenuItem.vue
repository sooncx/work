<template>
  <div class="flowItem" :class="[displayData.status]">

    <div class="col-icon">
      <svg-icon v-if="displayData.status ==='success'" icon-class="success" />
    </div>
    <div class="col-title">
      上线状态
    </div>
    <div class="col-des">
      只有上线后才可使用此功能
    </div>
    <div class="col-status">
      未测试
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      displayData: {
        status: 'success'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$c-success:#22CB64;
.flowItem{
  font-size: 14px;
  display: flex;
  align-items: center;
  &.success{
    >.col-icon{
      color: $c-success;
    }
    >.col-title{
      color: $c-success;
    }
    >.col-status{
      color: $c-success;
    }
  }
  &+.flowItem{
    margin-top:6px;
  }
  >.col-icon{
    font-size: 16px;
    color: #999;
    margin-right: 10px;
  }
  >.col-title{
    color: #898989;
    width: 120px;
    font-weight: 600;
  }
  >.col-des{
    color: #ABABAB;
    flex: 1;
  }
  >.col-status{
    width: 100px;
    color: #595959;
  }
}
</style>

