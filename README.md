# 🌟 星星榜 - KET/PET 打卡学习平台

> 专为三年级小朋友设计的英语打卡练习平台

## 📱 产品定位

- **目标用户**：小学三年级学生（8-9 岁）
- **使用场景**：每天 15 分钟英语打卡练习
- **核心价值**：真题训练 + 错题积累 + 成长激励

## 🏗️ 技术架构

- **前端**：Vue 3 + Vite + TailwindCSS（响应式，支持 PC/iPad）
- **后端**：Node.js + Express + PostgreSQL
- **部署**：Docker Compose
- **存储**：MinIO（图片/音频文件）

## 🚀 快速部署

### 前置要求

- Docker 20+
- Docker Compose 2.0+
- Nginx（已配置 SSL）

### 部署步骤

```bash
# 1. 克隆项目
cd /root/projects
git clone git@github.com:ixx9527/xxb-ket-pet.git xxb-ket-pet
cd xxb-ket-pet

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，修改密码等配置

# 3. 一键部署
./scripts/deploy.sh

# 4. 配置 Nginx
sudo cp scripts/nginx.conf /etc/nginx/conf.d/www.ixx9527.xin.conf
sudo nginx -t && sudo systemctl reload nginx
```

## 📁 目录结构

```
xxb-ket-pet/
├── docker-compose.yml      # Docker 配置
├── .env.example            # 环境变量模板
├── frontend/               # Vue 3 前端（儿童友好 UI）
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── views/          # 6 个页面组件
│       └── style.css       # 儿童友好样式
├── backend/                # Node.js 后端 API
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── routes/         # 5 个路由模块
├── scripts/
│   ├── deploy.sh           # 部署脚本
│   ├── init.sql            # 数据库初始化（8 张表）
│   ├── sample-data.sql     # KET/PET 真题（80+ 题）
│   └── nginx.conf          # Nginx 配置
└── data/                   # 持久化数据（.gitignore）
```

## 📋 功能模块

| 模块 | 功能 |
|------|------|
| 📚 每日练习 | 真题/模拟题，每天 5-8 题，限时 15 分钟 |
| ❌ 错题本 | 自动收录，支持重做、标记掌握 |
| 🏆 成长系统 | 积分/等级/勋章，打卡日历 |
| 📊 学习报告 | 周报/月报，薄弱点分析，学习建议 |
| 🏅 排行榜 | 周榜/月榜，激励竞争 |

## 🔧 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 重启服务
docker-compose restart

# 更新部署
git pull && ./scripts/deploy.sh

# 进入数据库
docker exec -it xxb-postgres psql -U xxb -d xxb_db

# 导入真题数据
docker exec -i xxb-postgres psql -U xxb -d xxb_db < scripts/sample-data.sql
```

## 📞 技术支持

网站：https://www.ixx9527.xin
