import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端API基础URL
  timeout: 10000
})

export default {
  // 获取文件列表
  getFiles(params = {}) {
    return api.get('/cos/files', { params })
      .then(response => {
        console.log('原始API响应:', response.data) // 调试日志
        return response
      })
      .catch(error => {
        console.error('API请求失败:', error)
        throw error
      })
  },

  // 上传文件
  uploadFile(file, key = null) {
    const formData = new FormData()
    formData.append('file', file)
    if (key) formData.append('key', key)
    
    return api.post('/cos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 获取文件预览URL
  getPreviewUrl(fileKey) {
    return api.get('/preview/preview', {
      params: { fileKey }
    })
  },

  // 获取文件下载URL
  getDownloadUrl(key, useCustomDomain = false) {
    return api.get('/cos/file-url', {
      params: { key, custom: useCustomDomain }
    })
  }
}