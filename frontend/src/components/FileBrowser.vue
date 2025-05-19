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
      
      <table>
        <thead>
          <tr>
            <th>类型</th>
            <th>名称</th>
            <th>大小</th>
            <th>修改时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in files" :key="item.Key">
            <td>
              <span v-if="item.Key.endsWith('/')">📁</span>
              <span v-else>📄</span>
            </td>
            <td>{{ item.Key }}</td>
            <td>{{ formatFileSize(item.Size) }}</td>
            <td>{{ formatDate(item.LastModified) }}</td>
            <td>
              <button v-if="!item.Key.endsWith('/')" @click="previewFile(item.Key)">预览</button>
              <button v-if="!item.Key.endsWith('/')" @click="downloadFile(item.Key)">下载</button>
            </td>
          </tr>
        </tbody>
      </table>
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

export default {
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
    
    async previewFile(key) {
      try {
        const response = await cosApi.getPreviewUrl(key)
        this.previewUrl = response.data.url
      } catch (error) {
        this.error = '获取预览URL失败: ' + error.message
        console.error('获取预览URL失败:', error)
      }
    },
    
    async downloadFile(key) {
      try {
        const response = await cosApi.getDownloadUrl(key)
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
/* 原有样式保持不变，新增调试信息样式 */
.debug-info {
  background-color: #f5f5f5;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.debug-info pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

/* 其他原有样式... */
</style>