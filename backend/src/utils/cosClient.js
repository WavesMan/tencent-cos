import COS from 'cos-nodejs-sdk-v5';
import { 
  SecretId,
  SecretKey,
  TmpSecretId,
  TmpSecretKey,
  SecurityToken,
  ExpiredTime,
  Region,
  Bucket,
  UploadTimeout,
  DownloadTimeout
} from '../../config/cosConfig.js';

// 日志函数
const logRequest = (method, params) => {
  console.info(`[COS INFO] ${new Date().toISOString()}`);
  console.info(`Method: ${method}`);
  console.info('Params:', JSON.stringify(params, null, 2));
  console.info('----------------------------------------');
};

// 初始化COS客户端
const getCosClient = () => {
  // 创建并配置COS实例
  const createCosInstance = (config) => {
    const cos = new COS(config);
  
    // 添加请求拦截器记录日志
    cos.on('request', (req) => {
      logRequest(req.method, {
        Bucket: req.Bucket,
        Region: req.Region,
        Key: req.Key,
        UploadId: req.UploadId,
        PartNumber: req.PartNumber
      });
    });

    return cos;
  };

  // 优先使用长期密钥(临时解决方案)
  if (SecretId && SecretKey) {
    return createCosInstance({
      SecretId,
      SecretKey,
      Region,
      Timeout: DownloadTimeout
    });
  }

  // 临时密钥(推荐但需要完整配置)
  if (TmpSecretId && TmpSecretKey && SecurityToken && ExpiredTime > Date.now()) {
    return createCosInstance({
      SecretId: TmpSecretId,
      SecretKey: TmpSecretKey,
      SecurityToken,
      Region,
      Timeout: UploadTimeout,
      UploadCheckContentMd5: true,
      ChunkRetryTimes: 3
    });
  }

  throw new Error('Missing COS credentials configuration');
};

// 创建客户端实例
const cos = getCosClient();

// 监听密钥更新事件
process.on('COS_CREDENTIALS_UPDATE', () => {
  try {
    const newClient = getCosClient();
    Object.assign(cos, newClient);
    console.log('COS client credentials updated successfully');
  } catch (error) {
    console.error('Failed to update COS client credentials:', error);
  }
});

export { 
  cos,
  Bucket
};