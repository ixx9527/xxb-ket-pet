# ⚡ 星星榜 - 快速开始指南

## 🎯 5 分钟部署上线

### 1️⃣ 在 ECS 上执行

```bash
# 创建目录
sudo mkdir -p /root/projects && cd /root/projects

# 克隆代码（如果有 Git 仓库）
git clone <你的仓库地址> xxb-ket-pet
cd xxb-ket-pet

# 或者：如果没有 Git，将本地项目打包上传
# tar -czf xxb-ket-pet.tar.gz /home/admin/.openclaw/workspace/xxb-ket-pet
# 然后上传到 ECS 并解压
```

### 2️⃣ 配置环境变量

```bash
cd /root/projects/xxb-ket-pet

# 复制配置
cp .env.example .env

# 修改密码（重要！）
vi .env
# 修改 DB_PASSWORD 和 JWT_SECRET
```

### 3️⃣ 一键部署

```bash
# 执行部署脚本
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 4️⃣ 配置 Nginx

```bash
# 复制 Nginx 配置
sudo cp scripts/nginx.conf /etc/nginx/conf.d/www.ixx9527.xin.conf

# 测试并重载
sudo nginx -t && sudo systemctl reload nginx
```

### 5️⃣ 配置 HTTPS

```bash
# 申请 SSL 证书
sudo certbot --nginx -d www.ixx9527.xin
```

---

## ✅ 验证部署

### 检查服务

```bash
cd /root/projects/xxb-ket-pet
docker-compose ps
```

应该看到：
- xxb-frontend
- xxb-backend
- xxb-postgres
- xxb-redis

### 访问网站

打开浏览器访问：https://www.ixx9527.xin

### 测试 API

```bash
curl https://www.ixx9527.xin/api/health
```

应返回：`{"status":"ok",...}`

---

## 📚 导入测试数据

```bash
# 进入数据库容器
docker exec -it xxb-postgres psql -U xxb -d xxb_db -f /docker-entrypoint-initdb.d/sample-data.sql

# 或者手动导入
docker exec -i xxb-postgres psql -U xxb -d xxb_db < scripts/sample-data.sql
```

---

## 👤 创建测试账号

```bash
# 进入数据库
docker exec -it xxb-postgres psql -U xxb -d xxb_db

-- 创建测试用户（密码：123456）
INSERT INTO users (name, grade) VALUES ('测试同学', 3);
INSERT INTO user_accounts (user_id, username, password_hash) 
VALUES (1, 'test001', '$2a$10$rQEY7VJzKqG8kqJ5zQxW5.3yqG8kqJ5zQxW5.3yqG8kqJ5zQxW5.3');
INSERT INTO growth (user_id) VALUES (1);
```

或使用 API 注册（需要实现注册功能）。

---

## 🔄 日常运维

### 更新代码

```bash
cd /root/projects/xxb-ket-pet
git pull
./scripts/deploy.sh
```

### 查看日志

```bash
docker-compose logs -f
```

### 备份数据库

```bash
docker exec xxb-postgres pg_dump -U xxb xxb_db > backup.sql
```

---

## 🎨 下一步开发

1. **完善前端页面** - 替换占位页面为完整功能
2. **导入更多真题** - 使用 sample-data.sql 格式批量导入
3. **添加家长通知** - 集成微信/钉钉
4. **优化 UI/UX** - 增加动画、音效等儿童友好元素
5. **性能优化** - 根据实际使用情况调整配置

---

## 📞 遇到问题？

查看完整文档：
- `README.md` - 项目介绍
- `DEPLOYMENT.md` - 详细部署指南
- `API.md` - API 接口文档

常用命令：
```bash
docker-compose ps          # 查看状态
docker-compose logs -f     # 查看日志
docker-compose restart     # 重启服务
docker-compose down        # 停止服务
```
