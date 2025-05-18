# 腾讯云COS对象存储后端服务

当前版本: v1.0.0

基于Express.js的腾讯云COS对象存储管理后端，提供文件管理、访问URL生成和文件预览功能。

## 技术栈

- **运行时**: Node.js (建议v16+)
- **框架**: Express.js
- **腾讯云SDK**: cos-nodejs-sdk-v5
- **包管理**: Yarn

## 环境要求

- Node.js 16+
- Yarn 1.x
- 腾讯云COS服务账号

## 安装指南

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

复制`.env.example`为`.env`并配置以下参数：

```ini
# 腾讯云COS配置
COS_SECRET_ID=your-secret-id
COS_SECRET_KEY=your-secret-key
COS_REGION=ap-guangzhou  # 存储桶地域
COS_BUCKET_NAME=your-bucket-name  # 存储桶名称

# 服务器配置
PORT=3000  # 服务端口

# 自定义域名配置(可选)
CUSTOM_DOMAIN=your-custom-domain.com
```

## API文档

### 文件管理

**获取文件列表**
```
GET /api/cos/files
```
参数：
- `Prefix`: 文件前缀过滤
- `Marker`: 分页标记
- `MaxKeys`: 每页数量(默认100)

**生成文件URL**
```
GET /api/cos/file-url
```
参数：
- `key`: 文件键名
- `custom`: 是否使用自定义域名(true/false)

### 文件预览

**获取预览URL**
```
GET /api/preview/preview
```
参数：
- `fileKey`: 文件键名

支持预览类型：
- 图片(jpg/png/gif等)
- 视频(mp4/webm等)
- 文本(txt/md等)
- 文档(通过数据万象转HTML)

## 开发指南

1. 启动开发服务器
```bash
yarn start
```

2. 开发时自动重启(需安装nodemon)
```bash
yarn dev
```

3. 代码规范
- 使用ESLint进行代码检查
- 遵循JavaScript Standard Style

## 部署说明

### 生产环境部署

1. 构建生产版本
```bash
yarn build
```

2. 使用PM2运行
```bash
pm2 start src/app.js --name cos-backend
```

### 监控与维护

- 建议配置：
  - 日志轮转
  - 进程监控
  - 健康检查端点`/api/health`

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

## 已知问题

1. 存储桶名解析存在问题