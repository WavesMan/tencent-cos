import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env') });

// COS配置信息
export const SecretId = process.env.COS_SECRET_ID || 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 长期密钥ID(保留作为后备)
export const SecretKey = process.env.COS_SECRET_KEY || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 长期密钥Key(保留作为后备)

// 临时密钥配置
export const TmpSecretId = process.env.COS_TMP_SECRET_ID || '';
export const TmpSecretKey = process.env.COS_TMP_SECRET_KEY || '';
export const SecurityToken = process.env.COS_SECURITY_TOKEN || '';
export const ExpiredTime = process.env.COS_EXPIRED_TIME || 0;

// 存储桶配置
export const Region = process.env.COS_REGION || 'ap-shanghai'; // 默认上海区域
export const Bucket = process.env.COS_BUCKET_NAME || 'bucketid-114514919'; // 使用完整存储桶名称
export const BucketDomain = process.env.COS_BUCKET_DOMAIN || ''; // 存储桶域名

// 操作配置
export const UploadTimeout = process.env.COS_UPLOAD_TIMEOUT || 60000; // 上传超时时间(毫秒)
export const DownloadTimeout = process.env.COS_DOWNLOAD_TIMEOUT || 60000; // 下载超时时间(毫秒)