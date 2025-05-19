# 腾讯云COS文件管理系统

当前版本: 前端v1.1.0 / 后端v1.0.0

完整的腾讯云COS对象存储文件管理解决方案，包含前端文件浏览器和后端API服务。

## 技术栈

### 前端
- **框架**: Vue 3 + Composition API
- **构建工具**: Vite 4
- **HTTP客户端**: Axios
- **路由**: Vue Router 4
- **状态管理**: 原生响应式API
- **UI**: 原生HTML/CSS + 自适应布局

### 后端
- **运行时**: Node.js (建议v16+)
- **框架**: Express.js
- **腾讯云SDK**: cos-nodejs-sdk-v5
- **包管理**: Yarn
- **URL生成**: 自定义URL签名生成模块

## 系统架构

```
前端(Vue 3) <-> 后端(Express.js) <-> 腾讯云COS
```

前端通过HTTP API与后端交互，后端使用腾讯云SDK管理COS存储桶。

## 项目结构

```
├── .gitignore            # Git忽略规则
├── package.json          # 根项目配置
├── README.md             # 项目文档
├── yarn.lock             # 依赖锁定文件
├── backend/              # 后端服务
│   ├── .env.example      # 环境变量示例
│   ├── package.json      # 后端依赖配置
│   ├── README.md         # 后端文档
│   ├── Tencent_COS-SDK.md # COS SDK文档
│   ├── src/              # 后端源代码
│   │   ├── app.js        # Express应用入口
│   │   ├── routes/       # API路由
│   │   │   ├── cosRoutes.js    # COS文件操作路由
│   │   │   └── previewRoutes.js # 文件预览路由
│   │   └── utils/        # 工具类
│   │       ├── cosClient.js     # COS客户端封装
│   │       └── urlGenerator.js  # URL签名生成器
│   ├── config/           # 服务配置
│   └── uploads/          # 上传文件临时存储
└── frontend/             # 前端应用
    ├── .gitignore        # 前端Git忽略规则
    ├── package.json      # 前端依赖配置
    ├── README.md         # 前端文档
    ├── public/           # 静态资源
    ├── src/              # 前端源代码
    │   ├── api/          # API接口
    │   │   └── cos.js    # COS API封装
    │   ├── assets/       # 静态资源
    │   ├── components/   # Vue组件
    │   │   ├── FileBrowser.vue  # 主文件浏览器组件
    │   │   └── HelloWorld.vue   # 示例组件
    │   ├── router/       # 路由配置
    │   │   └── index.js  # 路由定义
    │   ├── App.vue       # 根组件
    │   ├── main.js       # 应用入口
    │   └── style.css     # 全局样式
    └── vite.config.js    # Vite构建配置
```

## 功能特性

### 前端功能
- 文件列表展示(支持分页加载)
- 文件/文件夹区分显示
- 文件上传(支持自定义存储路径)
- 通过临时URL下载文件
- 文件大小智能格式化显示
- 修改时间本地化显示
- 多种文件类型预览(图片/视频/音频/文本/文档)

### 后端功能
- 文件上传(普通/分片)
- 文件列表获取
- 文件URL生成
- 文件预览URL生成
- 统一的错误处理机制
- 完善的API文档

## 环境要求

- Node.js 16+
- Yarn 1.x
- 腾讯云COS服务账号

## 安装指南

### 前端安装
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

### 后端安装
1. 克隆项目
```bash
git clone <repository-url>
```

2. 进入后端目录
```bash
cd backend
```

3. 安装依赖
```bash
yarn install
```

## 配置说明

### 前端配置
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

### 后端配置
复制`.env.example`为`.env`并配置以下参数：
```ini
# 腾讯云COS配置
COS_SECRET_ID=your-secret-id
COS_SECRET_KEY=your-secret-key
COS_REGION=ap-guangzhou
COS_BUCKET_NAME=your-bucket-name
COS_BUCKET_DOMAIN=your-bucket-domain

# 服务器配置
PORT=3000
```

## API文档

后端提供完整的RESTful API接口，详细文档请参考[backend/README.md](backend/README.md)。

## 开发指南

### 前端开发
1. 启动开发服务器
```bash
yarn dev
```

2. 访问开发环境
```
http://localhost:5173
```

### 后端开发
1. 启动开发服务器
```bash
yarn start
```

2. 开发时自动重启(需安装nodemon)
```bash
yarn dev
```

## 部署说明

### 前端部署
1. 构建生产版本
```bash
yarn build
```

2. 部署`dist`目录到Web服务器

### 后端部署
1. 构建生产版本
```bash
yarn build
```

2. 使用PM2运行
```bash
pm2 start src/app.js --name cos-backend
```

## 注意事项

1. 密钥安全：
   - 不要将`.env`文件提交到版本控制
   - 使用子账号密钥并遵循最小权限原则

2. 费用优化：
   - 注意数据万象服务的按页计费
   - 对高频访问文件启用CDN缓存

3. 性能建议：
   - 大文件使用分片上传
   - 频繁访问的列表数据添加缓存

4. 前端调试：
   - 开发时保持调试模式开启
   - 检查浏览器控制台日志