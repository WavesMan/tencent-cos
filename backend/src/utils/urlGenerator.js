import { cos } from './cosClient.js';
import { Region, Bucket, BucketDomain } from '../../config/cosConfig.js';

/**
 * 生成带签名的文件访问URL
 * @param {string} key - 文件键
 * @param {boolean} [useCustomDomain=true] - 是否使用自定义域名(默认true)
 * @param {number} [expires=3600] - URL有效期(秒)
 * @returns {Promise<string>} 带签名的文件URL
 */
const generateFileUrl = async (key, useCustomDomain = true, expires = 3600) => {
  return new Promise((resolve) => {
    // 处理自定义域名格式
    const cleanDomain = BucketDomain 
      ? BucketDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : null;

    // 生成URL选项
    const urlOptions = {
      Bucket,
      Region,
      Key: key,
      Sign: true,
      Expires: expires
    };

    // 如果使用自定义域名，添加Host头
    if (useCustomDomain && cleanDomain) {
      urlOptions.Headers = {
        Host: cleanDomain
      };
    }

    // 生成签名URL
    cos.getObjectUrl(urlOptions, (err, data) => {
      if (err) {
        console.error('Generate signed URL error:', err);
        // 失败时回退到无签名URL
        const fallbackUrl = (useCustomDomain && cleanDomain) 
          ? `https://${cleanDomain}/${key}`
          : `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;
        resolve(fallbackUrl);
      } else {
        // 如果使用自定义域名，替换URL中的域名部分
        if (useCustomDomain && cleanDomain) {
          const cosUrl = new URL(data.Url);
          const signedUrl = `https://${cleanDomain}${cosUrl.pathname}${cosUrl.search}`;
          resolve(signedUrl);
        } else {
          resolve(data.Url);
        }
      }
    });
  });
};

export { generateFileUrl };