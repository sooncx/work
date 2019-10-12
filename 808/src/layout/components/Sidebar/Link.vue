
<template>
  <!-- eslint-disable vue/require-component-is -->

  <component v-bind="linkProps(to)" @click="doTo">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    'itemData': {
      type: Object,
      required: 1
    },
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternalRrl() { // 是否是外链
      if (isExternal(this.url)) {
        return true
      }
      return false
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'div',
        to: url
      }
    }, doTo() {
      if (!this.isExternalRrl) {
        if (this.itemData.name === this.$route.name) { // 重复进入当前界面路由 刷新
          this.$router.replace({
            path: '/redirect' + this.to
          })
        } else {
          this.$router.push({
            path: this.to
          })
        }
      }
    }
  }
}
</script>
