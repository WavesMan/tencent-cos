# 腾讯云COS文件浏览器前端

当前版本: v1.1.0

基于Vue 3的腾讯云COS对象存储文件浏览器前端，提供完整的文件管理功能。

## 技术栈

- **框架**: Vue 3 + Composition API
- **构建工具**: Vite 4
- **HTTP客户端**: Axios
- **路由**: Vue Router 4
- **状态管理**: 原生响应式API
- **UI**: 原生HTML/CSS + 自适应布局

## 功能特性

### 文件管理
- 文件列表展示(支持分页加载)
- 文件/文件夹区分显示
- 文件上传(支持自定义存储路径)
- 通过临时URL下载文件
- 文件大小智能格式化显示
- 修改时间本地化显示

### 文件预览
- 支持多种文件类型预览:
  - 图片: jpg/jpeg/png/gif/webp
  - 视频: mp4/webm/ogg
  - 音频: mp3/wav/ogg
  - 文本: txt/md/json/xml
  - 文档: 通过数据万象转换为HTML

### 开发辅助
- 内置调试模式
- API请求/响应日志
- 多格式数据兼容处理

## 环境要求

- Node.js 16+
- Yarn 1.x
- 腾讯云COS服务

## 安装指南

1. 克隆项目
```bash
git clone <repository-url>
```

2. 进入前端目录
```bash
cd frontend
```

3. 安装依赖
```bash
yarn install
```

## 配置说明

1. 修改API基础URL (`src/api/cos.js`):
```javascript
const api = axios.create({
  baseURL: 'http://your-api-server.com/api', // 替换为实际API地址
  timeout: 10000
})
```

2. 启用调试模式 (`src/components/FileBrowser.vue`):
```javascript
data() {
  return {
    debugMode: true // 设置为false关闭调试信息
  }
}
```

## 开发指南

1. 启动开发服务器
```bash
yarn dev
```

2. 访问开发环境
```
http://localhost:5173
```

3. 开发时建议:
- 保持调试模式开启
- 检查浏览器控制台日志
- 使用ESLint维护代码规范

## 生产部署

1. 构建生产版本
```bash
yarn build
```

2. 部署`dist`目录到Web服务器

3. 建议配置:
- 启用Gzip压缩
- 配置HTTPS
- 设置缓存策略
