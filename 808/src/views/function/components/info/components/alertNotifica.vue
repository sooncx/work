<template>
  <span />
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  mounted() {
    this.open()
  },
  methods: {
    open() {
      this.$alert(this.data.data.cont, this.data.data.title, {
        confirmButtonText: '确定'
      })
    }
  }
}
</script>
