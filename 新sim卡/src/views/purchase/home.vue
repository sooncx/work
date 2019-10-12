<template>
        <div class="purchase-sim">
           <div class="purchar_box_pd" @click="$emit('Tolink','detail',item)" v-for="(item,index)  in simList" v-show="item.value" :key="index">
             <div class="purchase-item"  >
               <span class="fix-center item-font">{{item.gprsType}}</span>
           </div>
           </div>
       </div>
</template>


<script>
export default {
  data() {
    return {};
  },
  computed: {
    simList() {
      return this.$store.state.simList;
    }
  },
  methods: {

  },
  created() {
 
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/css/mixin.scss";

.purchase-sim {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  // justify-content: space-between;
  .purchar_box_pd {
    width: 250px;
    height: 170px;
    margin-right: 20px;
    // padding: 0 10px;
    &:nth-child(n + 2) {
      margin-top: 20px;
    }
  }
  .purchase-item {
    height: 100%;
    box-sizing: border-box;
    background: url("../../public/img/purchase/purchase.png");
    position: relative;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    .item-font {
      color: #fff;
      font-size: 36px;
      top: 40%;
    }
  }
}
</style>

