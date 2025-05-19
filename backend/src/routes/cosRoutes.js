import express from 'express';
import fs from 'fs';
import { cos, Bucket } from '../utils/cosClient.js';
import { Region } from '../../config/cosConfig.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 上传进度回调
const progressCallback = (req, res) => (progressData) => {
  const percent = Math.round(progressData.percent * 100);
  console.log(`Upload progress: ${percent}%`);
  // 可以通过WebSocket或EventSource实时推送进度到前端
};

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

/**
 * 普通文件上传
 * 支持进度回调
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: 'No file uploaded'
      });
    }

    const { path: filePath, originalname } = req.file;
    const key = `uploads/${Date.now()}_${originalname}`;

    const result = await new Promise((resolve, reject) => {
      cos.putObject({
        Bucket,
        Region,
        Key: key,
        Body: fs.createReadStream(filePath),
        onProgress: progressCallback(req, res)
      }, (err, data) => {
        // 上传完成后删除临时文件
        fs.unlink(filePath, () => {});
        
        if (err) return reject(err);
        resolve({
          key: data.Key,
          etag: data.ETag,
          url: `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`
        });
      });
    });

    res.json({
      code: 200,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err.message
    });
  }
});

/**
 * 分片上传初始化
 */
router.post('/multipart-init', async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({
        code: 400,
        message: 'Missing key parameter'
      });
    }

    const result = await new Promise((resolve, reject) => {
      cos.multipartInit({
        Bucket,
        Region,
        Key: key
      }, (err, data) => {
        if (err) return reject(err);
        resolve({
          uploadId: data.UploadId
        });
      });
    });

    res.json({
      code: 200,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err.message
    });
  }
});

/**
 * 上传分片
 */
router.post('/multipart-upload', upload.single('file'), async (req, res) => {
  try {
    const { uploadId, partNumber, key } = req.body;
    if (!uploadId || !partNumber || !key || !req.file) {
      return res.status(400).json({
        code: 400,
        message: 'Missing required parameters'
      });
    }

    const { path: filePath } = req.file;
    const result = await new Promise((resolve, reject) => {
      cos.multipartUpload({
        Bucket,
        Region,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: fs.createReadStream(filePath),
        onProgress: progressCallback(req, res)
      }, (err, data) => {
        // 上传完成后删除临时文件
        fs.unlink(filePath, () => {});
        
        if (err) return reject(err);
        resolve({
          partNumber: data.PartNumber,
          etag: data.ETag
        });
      });
    });

    res.json({
      code: 200,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err.message
    });
  }
});

/**
 * 完成分片上传
 */
router.post('/multipart-complete', async (req, res) => {
  try {
    const { uploadId, key, parts } = req.body;
    if (!uploadId || !key || !parts) {
      return res.status(400).json({
        code: 400,
        message: 'Missing required parameters'
      });
    }

    const result = await new Promise((resolve, reject) => {
      cos.multipartComplete({
        Bucket,
        Region,
        Key: key,
        UploadId: uploadId,
        Parts: parts.map(part => ({
          PartNumber: part.partNumber,
          ETag: part.etag
        }))
      }, (err, data) => {
        if (err) return reject(err);
        resolve({
          location: data.Location,
          key: data.Key,
          etag: data.ETag
        });
      });
    });

    res.json({
      code: 200,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err.message
    });
  }
});

/**
 * 查询分片上传任务
 */
router.get('/multipart-list', async (req, res) => {
  try {
    const { prefix } = req.query;
    const result = await new Promise((resolve, reject) => {
      cos.listMultipartUploads({
        Bucket,
        Region,
        Prefix: prefix || ''
      }, (err, data) => {
        if (err) return reject(err);
        resolve(data.Uploads || []);
      });
    });

    res.json({
      code: 200,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err.message
    });
  }
});

export default router;