<template>
  <div>
    <div
      v-for="(item,key,index) in data"
      :key="index"
    >
      <div
        v-if="!item.children"
        class="functionList-item"
        :class="[activeType===key?'active':'']"
        @click="toTestPage(item,key)"
      >
        <span class="col-index">{{ index +1 }}</span>
        <span class="col-name">{{ item.title }}</span>
        <span class="col-status">{{ item.stateTxt }}</span>
      </div>
      <section
        v-else
        class="functionList-ul"
        :class="{'open':openKeys.indexOf(key)!==-1}"
      >
        <div
          class="functionList-ul-title"
          @click="toggleOpen(key)"
        >
          <span class="col-index">{{ index +1 }}</span>
          <span class="col-name">
            {{ item.title }}
          </span>
          <span class="col-status">
            ({{ item.successNum ||0 }}/{{ item.childrenNum }})
            <i class="el-icon-arrow-down isOpen-icon " />
          </span>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="openKeys.indexOf(key)!==-1">
            <div
              v-for="(subItem,subKey,subIndex) in item.children"
              :key="subKey"
              class="functionList-item"
              :class="[activeType===(key+'/'+subKey)?'active':'']"
              @click="toTestPage(subItem,(key+'/'+subKey))"
            >
              <span class="col-index">{{ index +1 }}.{{ subIndex+1 }}</span>
              <span class="col-name">{{ subItem.title }}</span>
              <span class="col-status">{{ subItem.stateTxt }}</span>
            </div>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: 1
    },
    activeType: {
      type: Number,
      required: 1
    }
  },
  data() {
    return {
      openKeys: []
    };
  },
  methods: {
    toggleOpen(key) {
      var index = this.openKeys.indexOf(key);
      if (index === -1) {
        this.openKeys.push(key);
      } else {
        this.openKeys.splice(index, 1);
      }
    },
    toTestPage(data, key) {
      this.$emit("toTestPage", {
        data,
        key
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.functionList-item,
.functionList-ul-title {
  display: flex;
  line-height: 34px;
  cursor: pointer;
  &:nth-child(odd) {
    background: #fff;
  }
  &:hover,
  &.active {
    background: #1890ff;
    color: #fff;
  }
  > .col-index {
    padding-left: 15px;
    padding-right: 3px;
    text-align: left;
  }
  > .col-name {
    flex: 1;
  }
  > .col-status {
    width: 84px;
  }
}
.functionList-ul {
  &.open {
    .isOpen-icon {
      display: inline-block;
      transform: rotate(-180deg);
    }
  }
  &:hover {
    .isOpen-icon {
    }
    .functionList-ul-title {
      background-color: #f5f9fd;
      color: #333;
    }
  }
  .isOpen-icon {
    font-weight: 600;
    color: #1890ff;
    transition: all 0.5s;
  }
  .functionList-item {
    padding-left: 20px;
  }
}
.functionList-ul-title {
}
</style>
