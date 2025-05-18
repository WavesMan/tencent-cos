import express from 'express';
import { cos } from '../utils/cosClient.js';
import { Region, Bucket } from '../../config/cosConfig.js';

const router = express.Router();

/**
 * 获取文件列表
 * 支持分页和前缀过滤
 */
router.get('/files', async (req, res) => {
  try {
    const { Prefix, Marker, MaxKeys } = req.query;
    const data = await cos.getBucket({
      Bucket,
      Region,
      Prefix,
      Marker,
      MaxKeys: MaxKeys || 100,
    });
    
    res.json({
      list: data.Contents.map(item => ({
        Key: item.Key,
        Size: item.Size,
        LastModified: item.LastModified,
        ETag: item.ETag
      })),
      nextMarker: data.NextMarker,
      isTruncated: data.IsTruncated
    });
  } catch (err) {
    res.status(500).json({ 
      code: 500, 
      message: err.message 
    });
  }
});

/**
 * 生成文件访问URL
 * 支持自定义域名和签名URL
 */
router.get('/file-url', async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ 
        code: 400, 
        message: 'Missing key parameter' 
      });
    }

    const url = await new Promise((resolve) => {
      cos.getObjectUrl({
        Bucket,
        Region,
        Key: key,
        Sign: true,
        Expires: 3600
      }, (err, data) => {
        resolve(err ? null : data.Url);
      });
    });

    if (!url) {
      return res.status(500).json({ 
        code: 500, 
        message: 'Failed to generate URL' 
      });
    }

    res.json({ url });
  } catch (err) {
    res.status(500).json({ 
      code: 500, 
      message: err.message 
    });
  }
});

export default router;