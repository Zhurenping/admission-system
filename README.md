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
      "bdsj": "报到时间",
      "bz": "备注"
    }
  ],
  "batchId": "批次ID"
}
```

### 部署指南

#### 1. 安装Docker和Docker Compose

#### Windows服务器详细部署指南

##### 1. 系统环境准备
1. 确保服务器运行Windows Server 2016或更高版本
2. 以管理员身份登录服务器
3. 打开"服务器管理器"，点击"添加角色和功能"
4. 在"功能"选项卡中勾选"Containers"功能并完成安装

##### 2. 安装Docker Desktop
1. 访问Docker官网下载Windows版本：https://www.docker.com/products/docker-desktop/
2. 运行下载的Docker Desktop Installer.exe
3. 安装向导中勾选以下选项：
   - 启用WSL 2后端（推荐）
   - 将Docker Desktop快捷方式添加到桌面
4. 完成安装后重启服务器

##### 3. 配置Docker
1. 右键桌面Docker图标，选择"以管理员身份运行"
2. 首次启动时会提示安装WSL 2内核组件，点击链接下载并安装
3. 安装完成后Docker会自动启动
4. 右键系统托盘中的Docker图标，选择"Settings"：
   - 在"General"中勾选"Start Docker Desktop when you log in"
   - 在"Resources"中分配至少4GB内存
   - 在"Shared Drives"中共享项目所在驱动器

##### 4. 获取项目代码
1. 打开命令提示符(CMD)或PowerShell
2. 执行以下命令克隆项目：
```cmd
git clone https://github.com/your-repo/admission-system.git
cd admission-system
```

##### 5. 配置环境变量
1. 复制.env.example文件为.env：
```cmd
copy .env.example .env
```
2. 用文本编辑器打开.env文件，配置以下参数：
```ini
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_strong_password
DB_DATABASE=admission
PORT=3000
API_KEYS=your_api_key_1,your_api_key_2
```

##### 6. 启动服务
1. 在项目目录下打开PowerShell
2. 执行以下命令启动服务：
```powershell
docker-compose up -d --build
```
3. 查看服务状态：
```powershell
docker-compose ps
```
4. 查看实时日志：
```powershell
docker-compose logs -f
```

##### 7. 验证部署
1. 等待约2-3分钟让服务完全启动
2. 测试健康检查接口：
```cmd
curl http://localhost:3000/api/admission/health
```
应返回：`{"status":"ok"}`

##### 8. 配置防火墙
1. 打开"Windows Defender 防火墙"
2. 点击"高级设置"
3. 新建入站规则：
   - 规则类型：端口
   - 特定本地端口：3000
   - 允许连接
   - 应用所有配置文件
   - 名称：Admission-System-API

##### 9. 常见问题解决
- **问题1**：Docker启动失败
  - 解决方案：确保已启用Hyper-V和容器功能
- **问题2**：端口冲突
  - 解决方案：修改.env中的PORT变量或停止占用端口的服务
- **问题3**：数据库连接失败
  - 解决方案：检查.env中的数据库配置是否正确


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