import { cos } from './cosClient.js';
import { Region, Bucket } from '../../config/cosConfig.js';

/**
 * 生成文件访问URL
 * @param {string} key - 文件键
 * @param {boolean} [useCustomDomain=false] - 是否使用自定义域名
 * @returns {Promise<string>} 文件URL
 */
const generateFileUrl = async (key, useCustomDomain = false) => {
  return new Promise((resolve) => {
    const baseUrl = useCustomDomain 
      ? `https://your-custom-domain.com/${key}`
      : `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;

    cos.getObjectUrl({
      Bucket,
      Region,
      Key: key,
      Sign: true,
      Expires: 3600
    }, (err, data) => {
      if (err) {
        console.error('Generate URL error:', err);
        resolve(baseUrl); // 失败时返回基础URL
      } else {
        resolve(data.Url);
      }
    });
  });
};

export { generateFileUrl };