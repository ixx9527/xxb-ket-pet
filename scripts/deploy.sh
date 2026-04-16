#!/bin/bash

# ===========================================
# 星星榜 KET/PET 学习平台 - 部署脚本
# ===========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="/root/projects/xxb-ket-pet"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   星星榜 KET/PET 学习平台 - 部署脚本    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

cd $PROJECT_DIR

# 1. 检查 .env 文件
echo -e "${YELLOW}[1/6]${NC} 检查配置文件..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 文件不存在，从 .env.example 复制${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  请编辑 .env 文件，修改密码等配置后重新运行此脚本${NC}"
    exit 1
else
    echo -e "${GREEN}✓${NC} .env 文件存在"
fi

# 2. 检查 Docker
echo -e "${YELLOW}[2/6]${NC} 检查 Docker 环境..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker 已安装：$(docker --version)"

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker Compose 已安装：$(docker-compose --version)"

# 3. 创建数据目录
echo -e "${YELLOW}[3/6]${NC} 创建数据目录..."
mkdir -p data/postgres data/redis
echo -e "${GREEN}✓${NC} 数据目录已创建"

# 4. 停止旧容器
echo -e "${YELLOW}[4/6]${NC} 停止旧服务..."
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✓${NC} 旧服务已停止"

# 5. 构建并启动
echo -e "${YELLOW}[5/6]${NC} 构建并启动服务..."
docker-compose build --no-cache
docker-compose up -d

# 6. 等待服务就绪
echo -e "${YELLOW}[6/6]${NC} 等待服务启动..."
sleep 15

# 检查服务状态
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}服务状态:${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
docker-compose ps

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}最近日志:${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
docker-compose logs --tail=10

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ 部署完成！                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "🌐 访问地址：${GREEN}https://www.ixx9527.xin${NC}"
echo -e "📊 API 地址：${GREEN}https://www.ixx9527.xin/api/${NC}"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo "  查看状态：docker-compose ps"
echo "  查看日志：docker-compose logs -f"
echo "  重启服务：docker-compose restart"
echo "  停止服务：docker-compose down"
echo ""
