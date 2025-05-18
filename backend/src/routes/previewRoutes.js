import express from 'express';
import { generateFileUrl } from '../utils/urlGenerator.js';

const router = express.Router();

// 可直预览的文件类型
const PREVIEWABLE_TYPES = [
  'jpg', 'jpeg', 'png', 'gif',  // 图片
  'mp4', 'webm', 'ogg',         // 视频
  'mp3', 'wav',                 // 音频
  'txt', 'md', 'json'           // 文本
];

/**
 * 获取文件预览URL
 */
router.get('/preview', async (req, res) => {
  try {
    const { fileKey } = req.query;
    if (!fileKey) {
      return res.status(400).json({ 
        code: 400, 
        message: 'Missing fileKey parameter' 
      });
    }

    // 获取文件扩展名
    const fileExt = fileKey.split('.').pop().toLowerCase();
    
    // 常规可预览文件
    if (PREVIEWABLE_TYPES.includes(fileExt)) {
      const url = await generateFileUrl(fileKey);
      return res.json({ url, type: 'direct' });
    }

    // 文档类文件使用数据万象预览
    const previewUrl = `${await generateFileUrl(fileKey)}?ci-process=doc-preview&dstType=html`;
    res.json({ url: previewUrl, type: 'doc-preview' });
  } catch (err) {
    res.status(500).json({ 
      code: 500, 
      message: err.message 
    });
  }
});

export default router;