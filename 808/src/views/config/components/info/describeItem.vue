<template>
  <span class="dsc-item">
    <template v-if="typeof displyDsc==='string' ">
      {{ displyDsc }}
    </template>
    <template v-else-if="isArray(displyDsc)">
      <describeItem v-for="(item,index) in displyDsc" :key="index" in :dsc="item" @buttonClick="emitClick" />
    </template>
    <span v-else-if="typeof displyDsc==='object' ">
      <template v-if="displyDsc.type==='button'">
        <el-button class="dsc-button" size="mini" type="primary" plain @click.native="emitClick(displyDsc)">{{ displyDsc.title }}</el-button>
      </template>
      <template v-else-if="displyDsc.type==='displayInput'">
        <span class="displayInput-sp">{{ displyDsc.title }}</span>
      </template>
    </span>
  </span>
</template>

<script>
import { isArray } from '@/utils/validate'
export default {
  name: 'DescribeItem',
  props: {
    dsc: {
      type: [Object, String, Array]
    }
  },
  computed: {
    displyDsc() {
      return this.dsc
    }
  },
  methods: {
    emitClick(item) {
      this.$emit('buttonClick', item)
    },
    isArray(data) {
      return isArray(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.dsc-item{
  line-height: 20px;
  .dsc-button{
     vertical-align: middle;
     margin:0 2px;
  }
  .displayInput-sp{
  vertical-align: middle;
  display: inline-block;
  padding:2px 5px;
  border:1px solid #ddd;
}
}

</style>
