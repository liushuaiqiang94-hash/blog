# blog111

最小博客系统，包含三个应用：

- `blog-api`：Spring Boot 后端，负责登录、文章管理、公开文章接口
- `blog-web`：前台博客，提供首页和文章详情页
- `admin-web`：后台管理，提供登录和文章管理页面

## 技术栈

- 后端：Spring Boot 3、Spring Security、MyBatis、Flyway、MySQL
- 前端：Vue 3、Vue Router、Pinia、Vite、Vitest
- 本地数据库：Docker Compose + MySQL 8.0

## 目录结构

```text
blog111/
├─ blog-api/
├─ blog-web/
├─ admin-web/
├─ certs/
│  ├─ site/
│  └─ api/
├─ deploy/
│  └─ nginx/
├─ docker-compose.local.yml
└─ docker-compose.yml
```

## 本地开发

### 1. 启动数据库

```powershell
docker compose -f docker-compose.local.yml up -d
```

默认数据库信息：

- Host: `127.0.0.1`
- Port: `3306`
- Database: `blog111`
- Username: `blog111`
- Password: `blog111`
- Root Password: `root`

说明：

- `docker-compose.local.yml` 只给本地开发使用，专门提供一个固定账号密码的 MySQL
- 根目录的 `docker-compose.yml` 是服务器整站部署用，不建议本地联调时直接用它来起数据库

### 2. 启动后端

```powershell
cd blog-api
mvn spring-boot:run
```

默认后端地址：

- API: `http://127.0.0.1:8080`

默认管理员引导账号：

- Username: `admin`
- Password: `change-me-now`

配置来源见 `blog-api/src/main/resources/application.yml`。上线前务必改掉默认密码。

### 3. 启动前台

```powershell
cd blog-web
npm install
npm run dev
```

前台地址：

- `http://127.0.0.1:5173`

开发环境下，`/api` 已通过 Vite 代理转发到 `http://127.0.0.1:8080`。

### 4. 启动后台

```powershell
cd admin-web
npm install
npm run dev
```

后台地址：

- `http://127.0.0.1:5174`

开发环境下，`/api` 同样会代理到 `http://127.0.0.1:8080`。

## 服务器 Docker 部署

适用于你当前这套域名与证书：

- `https://hi-shuaiqiang.me`：前台博客
- `https://www.hi-shuaiqiang.me`：跳转到主站
- `https://api.hi-shuaiqiang.me`：后台管理

### 1. 上传整个目录

把整个 `blog111` 目录上传到服务器，比如：

- `/opt/blog111/blog111`

### 2. 放置证书

把证书文件放到这两个目录：

- `certs/site/fullchain.pem`
- `certs/site/privkey.key`
- `certs/api/fullchain.pem`
- `certs/api/privkey.key`

其中：

- `site` 证书用于 `hi-shuaiqiang.me` 和 `www.hi-shuaiqiang.me`
- `api` 证书用于 `api.hi-shuaiqiang.me`

### 3. 复制环境变量模板

```bash
cp .env.example .env
```

至少修改：

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `BLOG_BOOTSTRAP_ADMIN_PASSWORD`

### 4. 启动整站

```bash
docker compose up -d --build
```

### 5. 查看状态

```bash
docker compose ps
docker compose logs -f nginx
docker compose logs -f blog-api
```

容器结构：

- `mysql`：数据库
- `blog-api`：Spring Boot API
- `blog-web`：前台静态站点
- `admin-web`：后台静态站点
- `nginx`：HTTPS、域名分发、`/api` 反向代理

## 常用验证命令

### 后端

```powershell
cd blog-api
mvn test
```

### 前台

```powershell
cd blog-web
npm test -- --run
npm run build
```

### 后台

```powershell
cd admin-web
npm test -- --run
npm run build
```

## 生产部署概要

- 默认推荐使用根目录的 `docker-compose.yml` 进行单机部署
- `blog-api`、`blog-web`、`admin-web` 都会在服务器上直接构建镜像
- `Nginx` 根据两个子域名分发前后台，并统一反向代理 `/api`
- `MySQL` 使用 Docker volume 持久化

示例 Nginx 配置见 [deploy/nginx/conf.d/blog111.conf](deploy/nginx/conf.d/blog111.conf)。

更完整的部署步骤见 [docs/deployment.md](docs/deployment.md)。
