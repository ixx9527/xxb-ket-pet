# 🚀 星星榜 - ECS 部署指南

## 📋 前置准备

### 1. 在 ECS 上安装 Docker

```bash
# 更新系统
sudo yum update -y  # Alibaba Cloud Linux / CentOS
# 或
sudo apt update && sudo apt upgrade -y  # Ubuntu / Debian

# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2. 配置 Git（可选，用于拉取代码）

```bash
sudo yum install -y git  # Alibaba Cloud Linux / CentOS
# 或
sudo apt install -y git  # Ubuntu / Debian
```

---

## 📦 部署步骤

### 步骤 1：创建项目目录

```bash
sudo mkdir -p /root/projects
cd /root/projects
```

### 步骤 2：克隆项目代码

```bash
# 方式 A：从 Git 仓库克隆（推荐）
git clone <你的仓库地址> xxb-ket-pet
cd xxb-ket-pet

# 方式 B：如果没有 Git 仓库，可以手动创建文件
# 将本地项目打包上传到 ECS
```

### 步骤 3：配置环境变量

```bash
cd /root/projects/xxb-ket-pet

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
vi .env
# 或
nano .env
```

修改以下内容：
```bash
DB_PASSWORD=你的强密码
JWT_SECRET=随机生成的字符串
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin-secret
```

### 步骤 4：执行部署脚本

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 步骤 5：配置 Nginx

```bash
# 备份原配置
sudo cp /etc/nginx/conf.d/www.ixx9527.xin.conf /etc/nginx/conf.d/www.ixx9527.xin.conf.bak

# 复制新配置
sudo cp scripts/nginx.conf /etc/nginx/conf.d/www.ixx9527.xin.conf

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 步骤 6：配置 HTTPS（如果还没有）

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx  # Alibaba Cloud Linux
# 或
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu / Debian

# 申请证书
sudo certbot --nginx -d www.ixx9527.xin
```

---

## 🔧 常用运维命令

### 查看服务状态

```bash
cd /root/projects/xxb-ket-pet
docker-compose ps
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 重启服务

```bash
docker-compose restart
```

### 更新代码

```bash
cd /root/projects/xxb-ket-pet
git pull
./scripts/deploy.sh
```

### 进入数据库

```bash
docker exec -it xxb-postgres psql -U xxb -d xxb_db
```

### 备份数据库

```bash
docker exec xxb-postgres pg_dump -U xxb xxb_db > backup_$(date +%Y%m%d).sql
```

### 停止服务

```bash
docker-compose down
```

### 完全清理（删除所有数据）

```bash
docker-compose down -v
```

---

## 🔍 故障排查

### 容器启动失败

```bash
# 查看容器状态
docker-compose ps

# 查看详细日志
docker-compose logs backend

# 检查配置文件
docker-compose config
```

### 数据库连接失败

```bash
# 检查 .env 文件
cat .env | grep DATABASE_URL

# 测试数据库连接
docker exec -it xxb-postgres psql -U xxb -d xxb_db -c "SELECT NOW()"
```

### Nginx 代理失败

```bash
# 测试 Nginx 配置
sudo nginx -t

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log

# 检查后端是否运行
curl http://127.0.0.1:3000/health
```

---

## 📊 监控建议

### 设置自动备份

```bash
# 创建备份脚本
cat > /root/backup-xxb.sh << 'EOF'
#!/bin/bash
cd /root/projects/xxb-ket-pet
docker exec xxb-postgres pg_dump -U xxb xxb_db > /root/backups/xxb_$(date +%Y%m%d_%H%M%S).sql
# 保留最近 7 天的备份
find /root/backups -name "xxb_*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-xxb.sh

# 添加到 crontab（每天凌晨 2 点备份）
echo "0 2 * * * /root/backup-xxb.sh" | sudo crontab -
```

### 监控容器健康

```bash
# 查看容器健康状态
docker inspect --format='{{.State.Health.Status}}' xxb-postgres
docker inspect --format='{{.State.Health.Status}}' xxb-redis
```

---

## 🎯 下一步

1. **导入真题数据** - 使用 SQL 脚本导入 KET/PET 真题
2. **创建测试账号** - 为学生创建登录账号
3. **配置家长通知** - 集成微信/钉钉通知
4. **性能优化** - 根据实际使用情况调整配置

---

## 📞 技术支持

遇到问题？检查以下内容：

1. ✅ Docker 是否正常运行：`docker ps`
2. ✅ 容器是否都启动：`docker-compose ps`
3. ✅ 端口是否监听：`netstat -tlnp | grep 3000`
4. ✅ Nginx 配置是否正确：`sudo nginx -t`
5. ✅ SSL 证书是否有效：`curl -I https://www.ixx9527.xin`
