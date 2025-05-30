<template>
  <div class="file-browser">
    <h1>腾讯云COS文件浏览器</h1>
    
    <div class="upload-section">
      <input type="file" ref="fileInput" @change="handleFileChange" />
      <button @click="uploadFile">上传文件</button>
      <input v-model="uploadPath" placeholder="自定义存储路径(可选)" />
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="file-list">
      <div class="debug-info" v-if="debugMode">
        <h3>调试信息</h3>
        <pre>{{ debugData }}</pre>
      </div>
      
      <div class="tree-view">
        <tree-node 
          v-for="node in fileTree" 
          :key="node.path"
          :node="node"
          @preview="previewFile"
          @download="downloadFile"
        />
      </div>
      <div v-if="isTruncated" class="load-more">
        <button @click="loadMore">加载更多</button>
      </div>
    </div>

    <div v-if="previewUrl" class="preview-modal">
      <div class="modal-content">
        <span class="close" @click="previewUrl = null">&times;</span>
        <iframe :src="previewUrl" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import cosApi from '@/api/cos'
import TreeNode from './TreeNode.vue'

export default {
  components: {
    TreeNode
  },
  computed: {
    fileTree() {
      return this.buildFileTree(this.files)
    }
  },
  data() {
    return {
      files: [],
      selectedFile: null,
      uploadPath: '',
      previewUrl: null,
      loading: false,
      error: null,
      isTruncated: false,
      marker: null,
      debugMode: false,
      debugData: null
    }
  },
  async created() {
    await this.loadFiles()
  },
  methods: {
    async loadFiles() {
      this.loading = true
      this.error = null
      try {
        const response = await cosApi.getFiles()
        this.debugData = response.data // 存储原始响应数据
        
        // 处理多种可能的响应格式
        if (Array.isArray(response.data)) {
          // 情况1: 响应直接是数组
          this.files = response.data
          this.isTruncated = false
        } else if (response.data && Array.isArray(response.data.list)) {
          // 情况2: {list: [], isTruncated: "false"}
          this.files = response.data.list
          this.isTruncated = response.data.isTruncated === 'true'
        } else if (response.data && Array.isArray(response.data.Contents)) {
          // 情况3: {Contents: [], IsTruncated: false} (兼容旧格式)
          this.files = response.data.Contents
          this.isTruncated = response.data.IsTruncated || false
        } else {
          console.error('未知的响应格式:', response.data)
          throw new Error('无法识别的API响应格式')
        }
        
        console.log('文件列表加载成功:', this.files)
      } catch (error) {
        this.error = '获取文件列表失败: ' + error.message
        console.error('获取文件列表失败:', error, '响应数据:', this.debugData)
      } finally {
        this.loading = false
      }
    },
    
    async loadMore() {
      if (!this.isTruncated) return
      
      this.loading = true
      try {
        const lastKey = this.files[this.files.length - 1].Key
        const response = await cosApi.getFiles({
          Marker: lastKey
        })
        
        // 处理分页数据
        let newFiles = []
        if (Array.isArray(response.data)) {
          newFiles = response.data
        } else if (response.data.list) {
          newFiles = response.data.list
          this.isTruncated = response.data.isTruncated === 'true'
        } else if (response.data.Contents) {
          newFiles = response.data.Contents
          this.isTruncated = response.data.IsTruncated || false
        }
        
        this.files = [...this.files, ...newFiles]
      } catch (error) {
        this.error = '加载更多文件失败: ' + error.message
        console.error('加载更多文件失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === '0' || bytes === 0) return '0 B'
      if (!bytes) return '-'
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
    },
    
    formatDate(dateStr) {
      if (!dateStr) return '-'
      try {
        return new Date(dateStr).toLocaleString()
      } catch {
        return dateStr
      }
    },
    
    // 将平铺文件列表转换为树形结构
    buildFileTree(files) {
      const tree = []
      const pathMap = {}
      
      files.forEach(file => {
        const pathParts = file.Key.split('/').filter(p => p !== '')
        let currentLevel = tree
        
        pathParts.forEach((part, index) => {
          const isFile = index === pathParts.length - 1 && !file.Key.endsWith('/')
          const path = pathParts.slice(0, index + 1).join('/') + (isFile ? '' : '/')
          
          if (!pathMap[path]) {
            const node = {
              name: part,
              path: path,
              isDirectory: !isFile,
              children: [],
              data: isFile ? file : null
            }
            
            if (isFile) {
              pathMap[path] = node
              currentLevel.push(node)
            } else {
              pathMap[path] = node
              currentLevel.push(node)
              currentLevel = node.children
            }
          } else {
            currentLevel = pathMap[path].children
          }
        })
      })
      
      return tree
    },
    
    handleFileChange(event) {
      this.selectedFile = event.target.files[0]
    },
    
    async uploadFile() {
      if (!this.selectedFile) return
      
      this.loading = true
      try {
        await cosApi.uploadFile(this.selectedFile, this.uploadPath)
        this.$refs.fileInput.value = ''
        this.uploadPath = ''
        await this.loadFiles()
      } catch (error) {
        this.error = '上传文件失败: ' + error.message
        console.error('上传文件失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async previewFile(node) {
      if (node.isDirectory) {
        console.log('预览目录:', node.path)
        return
      }
      
      try {
        const response = await cosApi.getPreviewUrl(node.path)
        this.previewUrl = response.data.url
      } catch (error) {
        this.error = '获取预览URL失败: ' + error.message
        console.error('获取预览URL失败:', error)
      }
    },
    
    async downloadFile(node) {
      if (node.isDirectory) {
        console.log('目录不支持下载')
        return
      }
      
      try {
        const response = await cosApi.getDownloadUrl(node.path)
        window.open(response.data.url, '_blank')
      } catch (error) {
        this.error = '获取下载URL失败: ' + error.message
        console.error('获取下载URL失败:', error)
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/css/light-theme/FileBrowser-light.css';
</style>