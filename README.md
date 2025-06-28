# 高校录取查询系统API

基于Node.js和PostgreSQL的录取查询系统，提供考生查询和高校招办数据管理功能。

## 功能特性

- 考生查询：通过考生号和验证码查询录取状态
- 高校招办管理：
  - 单条更新录取数据
  - 批量导入录取数据
- 安全验证：
  - 考生查询：验证码验证
  - 高校招办API：API密钥认证

## API文档

### 考生查询API
`POST /admission/query`

请求体：
```json
{
  "ksh": "考生号",
  "sfyzm": "验证码"
}
```

### 高校招办单条更新
`POST /admission/admin/update`

请求头：
```
x-api-key: 有效的API密钥
```

请求体：
```json
{
  "admissionData": {
    "KSH": "考生号",
    // 其他可更新字段...
  },
  "batchId": "批次ID"
}
```

### 高校招办批量导入
`POST /admission/admin/import`

请求头：
```
x-api-key: 有效的API密钥
```

请求体：
```json
{
  "admissions": [
    {
      "KSH": "考生号1",
      // 其他字段...
    },
    {
      "KSH": "考生号2",
      // 其他字段...
    }
  ],
  "batchId": "批次ID"
}
```

## 部署指南

1. 确保已安装Docker和Docker Compose
2. 复制`.env.example`为`.env`并配置环境变量
3. 运行以下命令启动服务：
```bash
docker-compose up -d
```

## 环境变量

- `DB_*`: 数据库配置
- `PORT`: 应用端口(默认3000)
- `API_KEYS`: 逗号分隔的API密钥列表