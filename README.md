# 高校录取查询系统API

基于Node.js和PostgreSQL的录取查询系统，提供考生查询和高校招办数据管理功能。
该系统可由高校自行部署在公网服务器上，面向考生提供查询。同时，各类高校招生录取辅助系统能够通过API接口一键发布录取结果到录取查询系统（录取辅助系统可参考：http://www.fz-zs.cn）,

## 功能特性

- 考生查询：
  - 通过考生号和验证码查询录取状态；
  - 拉取最新公布的录取批次
- 高校招办管理：
  - 单条删除录取数据（根据考生号）
  - 批量导入录取数据（有则覆盖，无则新增）
- 安全验证：
  - 考生查询：身份证后4位验证
  - 高校招办API：Bearer Token认证

## API文档

### 健康检查
`GET /api/admission/health`

### 考生查询API
`POST /api/admission/query`

请求体：
```json
{
  "ksh": "考生号",
  "sfyzm": "验证码"
}
```

### 获取最新查询批次
`POST /api/admission/batches`

请求体：
```json
{
  "key": "youngpig"
}
```

返回示例：
```json
{
  "ID": "批次ID",
  "PC": "批次名称"
}
```

### 高校招办单条删除
`DELETE /api/admission/{考生号}`

请求头：
```
Authorization: Bearer your_token_here
```

### 高校招办批量导入
`POST /api/admission/admin/import`

请求头：
```
Authorization: Bearer your_token_here
Content-Type: application/json
```

请求体：
```json
{
  "admissions": [
    {
      "ksh": "考生号",
      "zkzh": "准考证号",
      "sfzh": "身份证号",
      "xm": "姓名",
      "xb": "性别",
      "lqzt": "录取状态",
      "ssmc": "省市名称",
      "pcmc": "批次名称",
      "klmc": "科类名称",
      "jhxz": "计划性质",
      "tdcj": "投档成绩",
      "yxmc": "院校名称",
      "lqzymc": "录取专业名称",
      "xymc": "学院名称",
      "xqmc": "校区名称",
      "tzsbh": "通知书编号",
      "emsdh": "EMS单号",
      "sfyzm": "验证码",
      "jtdz": "家庭地址",
      "yzbm": "邮政编码",
      "sjr": "收件人",
      "sjh": "手机号",
      "bdsj": "变动时间",
      "bz": "备注"
    }
  ],
  "batchId": "批次ID"
}
```

## 部署指南

### 1. 安装Docker和Docker Compose

#### Windows系统
1. 下载Docker Desktop: https://www.docker.com/products/docker-desktop/
2. 运行安装程序并按照向导完成安装
3. 安装完成后启动Docker Desktop

#### Linux系统 (Ubuntu为例)
```bash
# 卸载旧版本
sudo apt-get remove docker docker-engine docker.io containerd runc

# 安装依赖
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加Docker官方GPG密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装Docker引擎
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 验证安装
sudo docker run hello-world
```

#### macOS系统
1. 下载Docker Desktop: https://www.docker.com/products/docker-desktop/
2. 将Docker.app拖到Applications文件夹
3. 启动Docker应用

### 2. 配置环境变量
1. 复制`.env.example`为`.env`
2. 编辑`.env`文件配置以下变量：
   - `DB_HOST`: 数据库主机地址
   - `DB_PORT`: 数据库端口(默认5432)
   - `DB_USERNAME`: 数据库用户名
   - `DB_PASSWORD`: 数据库密码
   - `DB_DATABASE`: 数据库名称
   - `PORT`: 应用端口(默认3000)
   - `API_KEYS`: 逗号分隔的API密钥列表(用于生成Bearer Token)

### 3. 启动服务
```bash
# 构建并启动容器
docker-compose up -d --build

# 查看服务日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 4. 验证部署
访问健康检查接口验证服务是否正常运行：
```
GET http://localhost:3000/api/admission/health
```

## 环境变量

- `DB_*`: 数据库配置
- `PORT`: 应用端口(默认3000)
- `API_KEYS`: 逗号分隔的API密钥列表