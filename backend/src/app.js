import express from 'express';
import cors from 'cors';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 示例路由
app.get('/api/data', (req, res) => {
  res.json({ message: 'Data from backend' });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});