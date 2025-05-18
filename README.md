# Tencent-COS 项目

这是一个基于Vite 6 + Vue 3的前端和Express后端的全栈项目模板，使用Yarn作为包管理器。

## 技术栈

### 前端
- Vue 3 (Composition API)
- Vite 6
- TypeScript
- Vue Router 4
- Pinia (状态管理)
- Axios (HTTP客户端)
- Element Plus (UI组件库)

### 后端
- Express.js
- CORS (跨域支持)

## 项目结构

```
tencent-cos/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── router/    # Vue Router配置
│   │   ├── store/     # Pinia状态管理
│   │   └── api/       # Axios请求封装
│   ├── vite.config.ts # Vite配置
│   └── package.json   # 前端依赖
└── backend/           # 后端项目
    ├── src/
    │   ├── routes/    # API路由
    │   ├── models/    # 数据模型
    │   └── app.js     # Express应用入口
    └── package.json   # 后端依赖
```

## 快速开始

### 前置要求
- Node.js (建议v16+)
- Yarn (建议v1.22+)

### 安装依赖

1. 前端依赖安装:
```bash
cd frontend && yarn install
```

2. 后端依赖安装:
```bash
cd backend && yarn install
```

### 开发模式运行

1. 启动前端开发服务器:
```bash
cd frontend && yarn dev
```

2. 启动后端服务器:
```bash
cd backend && yarn start
```

前端默认运行在 `http://localhost:5173`  
后端默认运行在 `http://localhost:3000`

## 开发配置

### 前端代理配置
前端已配置代理到后端API，避免跨域问题。  
修改 `frontend/vite.config.ts` 中的代理设置:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 环境变量
创建 `.env` 文件来设置环境变量:

```
# .env.development
VITE_API_URL=/api
```

## 构建与部署

### 前端生产构建
```bash
cd frontend && yarn build
```

构建产物将生成在 `frontend/dist` 目录。

### 后端生产运行
```bash
cd backend && yarn start
```

## 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 许可证

MIT