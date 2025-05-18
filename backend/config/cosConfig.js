// COS配置信息
export const SecretId = process.env.COS_SECRET_ID || ''; // 从环境变量获取
export const SecretKey = process.env.COS_SECRET_KEY || ''; // 从环境变量获取
export const Region = process.env.COS_REGION || 'ap-shanghai'; // 默认上海区域
export const Bucket = process.env.COS_BUCKET_NAME || 'your-bucket-name'; // 使用完整存储桶名称