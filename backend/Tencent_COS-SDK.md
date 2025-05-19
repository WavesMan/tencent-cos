# 腾讯云 COS Node.js SDK

## 快速入门

**最近更新时间：2025-03-14 19:03:21**

### 下载与安装

#### 环境要求
- Node.js 版本 ≥ 6
- npm 包管理器

**说明：**
如果遇到函数或方法不存在等错误，请先升级到最新版 SDK 。

#### 安装 SDK
```bash
npm i cos-nodejs-sdk-v5 --save
```

### 开始使用

#### 初始化

**注意：**
推荐使用临时密钥以提高安全性 。如必须使用永久密钥，请遵循最小权限原则 。

##### 推荐：使用临时密钥初始化
```javascript
const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
    getAuthorization: function(options, callback) {
        // 您的临时密钥实现
    }
});
```

##### 不推荐：使用永久密钥初始化
```javascript
const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
    SecretId: '您的SecretId',
    SecretKey: '您的SecretKey'
});
```

### 配置参数
`new COS(options)` 主要配置项说明 ：

| 参数名 | 参数描述 | 类型 | 是否必填 |
|--------|----------|------|----------|
| SecretId | 用户的 SecretId | String | 是 |
| SecretKey | 用户的 SecretKey | String | 是 |
| FileParallelLimit | 文件上传并发数（默认：3） | Number | 否 |
| ChunkSize | 分块大小（单位字节，默认1MB） | Number | 否 |
| Timeout | 超时时间（毫秒，默认0不超时） | Number | 否 |

### 使用示例

#### 回调方式
```javascript
cos.uploadFile({...}, function(err, data) {
    if (err) console.error(err);
    else console.log(data);
});
```

#### Promise方式
```javascript
cos.uploadFile({...})
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

#### 同步方式
```javascript
async function upload() {
    try {
        const data = await cos.uploadFile({...});
        return data;
    } catch(err) {
        throw err;
    }
}
```

### 常见操作

#### 创建存储桶
```javascript
cos.putBucket({
    Bucket: 'examplebucket-1250000000',
    Region: 'COS_REGION'
}, function(err, data) {
    console.log(err || data);
});
```

#### 上传对象
```javascript
cos.putObject({
    Bucket: 'examplebucket-1250000000',
    Region: 'COS_REGION',
    Key: 'exampleobject',
    Body: fs.createReadStream('./exampleobject')
}, function(err, data) {
    console.log(err || data);
});
```

#### 下载对象
```javascript
cos.getObject({
    Bucket: 'examplebucket-1250000000',
    Region: 'COS_REGION',
    Key: 'exampleobject',
    Output: fs.createWriteStream('./exampleobject')
}, function(err, data) {
    console.log(err || data);
});
```


## 参考文档
- [COS术语信息](https://cloud.tencent.com/document/product/436/7751)
- [临时密钥生成及使用指引](https://cloud.tencent.com/document/product/436/14048)
- [最小权限指引原则](https://cloud.tencent.com/document/product/436/38618)**