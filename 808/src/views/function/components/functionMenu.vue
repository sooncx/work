<template>
  <div>
    <div
      v-for="(item,key,index) in data"
      :key="index"
    >
      <div
        v-if="!item.children"
        class="functionList-item"
        :class="[String(activeType)===String(key)?'active':'']"
        @click="toTestPage(item,key)"
      >
        <!-- ,item.state===stateCodes.success?'disabled':'' -->
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
import { stateCodes } from "@/utils/functionUtil";
export default {
  props: {
    data: {
      type: Object,
      required: 1
    },
    activeType: {
      type: [Number, String],
      required: 1
    }
  },
  // props: ["data", "activeType", "flag"],
  data() {
    return {
      openKeys: [String(this.activeType).split("/")[0]],
      stateCodes
    };
  },
  methods: {
    toggleOpen(key) {
      // 切换功能前 限制切换
      const notTestCondition = [
        undefined,
        this.stateCodes.undetected,
        this.stateCodes.process
      ]; // 当前功能未测试
      const stepSuccessCondition = [this.stateCodes.success]; // 第一个步骤通过
      /**
       * 可以切换的前提：
       *    1.已有测试结果（测试通过|测试不通过）+第一个步骤通过-切换功能
       *    2.未测试+第一个步骤不通过
       *
       */
      if (
        !notTestCondition.includes(this.stepStatusList[0]) ||
        (notTestCondition.includes(this.stepStatusList[0]) &&
          !stepSuccessCondition.includes(this.stepStatusList[1]))
      ) {
        var index = this.openKeys.indexOf(key);
        if (index === -1) {
          this.openKeys.push(key);
        } else {
          this.openKeys.splice(index, 1);
        }
      } else {
        this.$message({
          type: "info",
          message: "请先测试完本轮功能"
        });
      }
      //console.log("stepStatusList:" + JSON.stringify(this.stepStatusList));
      //stepStatusList:{"0":1,"1":1}第一个参数表示当前选项测试结果是否通过，0检测中，1通过，2不通过；
      //第二个参数表示当前选项第一个步骤按钮是否通过，1通过，2不通过
    },
    toTestPage(data, key) {
      // if (data.state === this.stateCodes.success) return
      this.$emit("toTestPage", {
        data,
        key
      });
    }
  },
  computed: {
    stepStatusList() {
      return this.$store.state.testFunction.stepStatusList;
    }
  }
};
</script>

<style lang="scss" scoped>
.functionList-item {
  &.disabled {
    color: #999;
    cursor: no-drop;
    &:hover {
      background: transparent;
      color: #999;
    }
  }
}

.functionList-item,
.functionList-ul-title {
  display: flex;
  line-height: 34px;
  cursor: pointer;
  &:nth-child(odd) {
    background: #fff;
  }
  &:hover,
  &.active,
  &.disabled.active,
  &.disabled.active:hover {
    background: #1890ff;
    color: #fff;
  }
  > .col-index {
    padding-left: 8px;
    padding-right: 4px;
    text-align: left;
  }
  > .col-name {
    flex: 1;
  }
  > .col-status {
    width: 65px;
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
