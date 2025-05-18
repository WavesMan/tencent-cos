import express from 'express';
import cors from 'cors';
import cosRoutes from './routes/cosRoutes.js';
import previewRoutes from './routes/previewRoutes.js';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/cos', cosRoutes);
app.use('/api/preview', previewRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    code: 500, 
    message: 'Internal Server Error' 
  });
});