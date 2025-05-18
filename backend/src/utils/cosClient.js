import COS from 'cos-nodejs-sdk-v5';
import { 
  SecretId, 
  SecretKey, 
  Region, 
  Bucket 
} from '../../config/cosConfig.js';

// 初始化COS客户端
const cos = new COS({
  SecretId,
  SecretKey,
  Region,
});

export { 
  cos
};