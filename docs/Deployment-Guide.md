# 录取系统部署指南

## 系统要求
- Docker 20.10+
- Docker Compose 2.0+
- 2GB以上内存
- 10GB以上磁盘空间

## 通用部署步骤

### 1. 获取代码
```bash
git clone https://github.com/your-repo/admission-system.git
cd admission-system
```

### 2. 配置环境变量
复制.env.example文件并修改：
```bash
cp .env.example .env
```

主要配置项：
```
# 数据库配置
POSTGRES_USER=admission
POSTGRES_PASSWORD=your_strong_password
POSTGRES_DB=admission_db

# API配置
API_PORT=3000
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret
```

### 3. 构建并启动服务
```bash
docker-compose up -d --build
```

## Windows系统部署

### 特别注意事项
1. 使用PowerShell执行命令
2. 确保已启用Hyper-V和容器功能
3. 防火墙开放3000端口

### 端口开放命令
```powershell
New-NetFirewallRule -DisplayName "Admission System API" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

## Linux/Ubuntu系统部署

### 特别注意事项
1. 需要sudo权限
2. 安装docker和docker-compose：
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
```
3. 需要重新登录使权限生效

### 端口开放命令
```bash
sudo ufw allow 3000/tcp
```

## API Key设置

### 1. 修改.env文件
```
API_KEY=your_actual_api_key_here
```

### 2. 在请求中使用API Key
```http
GET /api/admission/health
Authorization: Bearer your_actual_api_key_here
```

## 验证部署

### 检查服务状态
```bash
docker-compose ps
```

### 测试API
```bash
curl http://localhost:3000/api/admission/health
```

## 高校Logo更换

### 更换步骤
1. 准备替换的logo图片（推荐尺寸：200x60像素，PNG格式）
2. 替换文件：
```bash
# 替换默认logo文件
cp /path/to/your/logo.png public/img/logo.png
```
3. 清除浏览器缓存（强制刷新页面查看效果）

### 注意事项
- 图片路径：`public/img/logo.png`
- 支持PNG/JPG格式
- 建议保持相同文件名避免修改前端代码
- 如需修改文件名，需要同时修改HTML中的引用路径

## 常见问题

### 端口冲突
修改.env中的API_PORT变量，并更新docker-compose.yml中的端口映射

### 数据库连接问题
检查POSTGRES_USER和POSTGRES_PASSWORD配置

### API认证失败
确保请求头中包含正确的API Key：
```
Authorization: Bearer your_api_key
```

## 维护命令

### 停止服务
```bash
docker-compose down
```

### 查看日志
```bash
docker-compose logs -f
```

### 更新系统
```bash
git pull
docker-compose up -d --build