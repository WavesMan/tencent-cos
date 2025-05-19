<template>
  <div class="tree-node" :style="{ 'margin-left': `${depth * 20}px` }">
    <div class="node-header" @click="toggleExpand">
      <span class="node-icon">
        {{ node.isDirectory ? (isExpanded ? '📂' : '📁') : '📄' }}
      </span>
      <span class="node-name">{{ node.name }}</span>
      <span v-if="node.isDirectory" class="node-count">({{ node.children.length }})</span>
    </div>

    <div v-if="node.isDirectory && isExpanded" class="node-children">
      <tree-node
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
        @preview="onPreview"
        @download="onDownload"
      />
    </div>

    <div v-if="!node.isDirectory" class="file-actions">
      <button @click.stop="onPreview(node)">预览</button>
      <button @click.stop="onDownload(node)">下载</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isExpanded: this.depth < 1 // 默认展开第一级
    }
  },
  methods: {
    toggleExpand() {
      if (this.node.isDirectory) {
        this.isExpanded = !this.isExpanded
      }
    },
    onPreview(node) {
      this.$emit('preview', node)
    },
    onDownload(node) {
      this.$emit('download', node)
    }
  }
}
</script>

<style scoped>
.tree-node {
  margin: 5px 0;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.node-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.node-header:hover {
  background-color: #f5f5f5;
}

.node-icon {
  margin-right: 8px;
  font-size: 1.2em;
}

.node-name {
  font-weight: 500;
}

.node-count {
  margin-left: 8px;
  color: #888;
  font-size: 0.9em;
}

.file-actions {
  display: inline-block;
  margin-left: 15px;
}

.file-actions button {
  margin-right: 5px;
  padding: 2px 8px;
  font-size: 0.8em;
}
</style>