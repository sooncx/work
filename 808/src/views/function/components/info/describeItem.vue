<template>
  <span class="dsc-item">
    <template v-if="typeof displyDsc==='string' ">
      <span class="displyDsc">{{displyDsc}}</span>
    </template>
    <template v-if="typeof displyDsc==='object' && displyDsc.type==='txt'">
      <br>
    </template>
    <template v-if="isArray(displyDsc)">
      <describeItem
        v-for="(item,index) in displyDsc"
        :key="index"
        in
        :dsc="item"
        @buttonClick="emitClick"
      />
    </template>
    <span
      v-if="typeof displyDsc==='object' "
      class="dsc-item-children"
    >
      <template v-if="displyDsc.type==='button'">
        <el-button
          class="dsc-button"
          size="mini"
          type="primary"
          plain
          @click.native="emitClick(displyDsc)"
        >{{ displyDsc.title }}</el-button>
      </template>
      <!-- <template v-else-if="displyDsc.type==='displayInput'">
        <span class="displayInput-sp">{{ displyDsc.title }}</span>
      </template> -->
      <template v-else-if="displyDsc.componentName">
        <component
          :is="displyDsc.componentName"
          :data="displyDsc"
        />
      </template>
    </span>
  </span>
</template>

<script>
import customComponents from "./componentList.js";
import { isArray } from "@/utils/validate";
/** ********** */
export default {
  name: "DescribeItem",
  components: customComponents,
  props: {
    dsc: {
      type: [Object, String, Array]
    }
  },
  computed: {
    displyDsc() {
      return this.dsc;
    }
  },
  methods: {
    emitClick(item) {
      this.$emit("buttonClick", item);
    },
    isArray(data) {
      return isArray(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.displyDsc {
  display: inline;
}
.displyDsc1 {
  display: block;
}
.dsc-item {
  line-height: 25px;
  .dsc-button {
    vertical-align: middle;
    // margin: 0 2px;
    // margin-top: -13px;
  }
}
.dsc-item-children {
  display: inline-block;
  vertical-align: middle;
}
// .flow-wrap .flow-Steps-dsc[data-v-1f05b0ed] {
//   padding-top: 15px;
// }
// .dsc-item[data-v-7e85979a] {
//   line-height: 1;
//   margin: 1px;
// }
</style>
