<template>
  <div class="my-Tree">
    <el-tree v-if="datatList&&datatList[0]" ref="tree" node-key="id" :data="datatList" :default-expanded-keys="expandedKeys" :highlight-current="true">
      <span slot-scope="{ node, data }" class="custom-tree-node online">
        <template>
          <span v-if="!node.isLeaf" class="label">
            {{ node.label }}
          </span>
          <span v-else class="label" @click="handleNodeClick(node)"><i class="el-icon-setting" />{{ node.label }}</span>
        </template>
      </span>
    </el-tree>

  </div>
</template>
<script>
export default {
  props: {
    datatList: {
      default: null,
      type: [Object, Array]
    }
  },
  data() {
    return {
      treeTopId: -1,
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id',
        parentId: 'parentId',
        type: 'type'
      },
      expandedKeys: [-1]
    }
  },
  computed: {
    data() {
      return [this.datatList]
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleNodeClick(node) {
      this.expandedKeys = [-1, node.data.id]
      this.$emit('nodeclick', node.data.id)
    },
    setCurrent(key) {
      this.$refs.tree.setCurrentKey(key)
      var node = this.$refs.tree.getNode(key)
      this.$emit('nodeclick', node.key)
      this.expandedKeys = [-1, node.parent.key]
    }
  }
}
</script>
<style lang="scss" scoped>
.my-Tree {
	display: flex;
	width: 100%;
	/deep/ .el-tree {
		flex: 1;
		// background-color: #fafafa;
	}
	/deep/ * {
		.el-tree-node__content:hover,
		.el-tree-node__content:active {
			background-color: #edf6ff;
		}
		.custom-tree-node {
			display: flex;
			align-items: center;
			width: 100%;

			.label {
				font-size: 12px;
				flex: 1;
				color: #58616c;
        i{
          margin-right: 5px;
        }
			}
		}
	}
}
</style>
