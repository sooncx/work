<template>
  <div class="desc-wrap">
    <template v-if="isArray(displyDsc)">
      <div v-for="(item,index) in displyDsc" :key="index">
        <describeItem :dsc="item" @buttonClick="emitClick" />
      </div>
    </template>
    <template v-else>
      <describeItem :dsc="displyDsc" @buttonClick="emitClick" />
    </template>
  </div>
</template>
<script>
import describeItem from './describeItem'
import { isArray } from '@/utils/validate'
export default {
  components: { describeItem },
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

