# blog111 Docker 部署说明

## 目标结构

建议使用这套最小部署结构：

- `https://hi-shuaiqiang.me`：前台博客
- `https://www.hi-shuaiqiang.me`：301 跳转到主站
- `https://api.hi-shuaiqiang.me`：后台管理
- `blog-api`：Docker 内网服务
- `MySQL`：Docker 内网服务
- `Nginx`：对外暴露 `80/443`，并统一代理 `/api`

## 服务器准备

- 安装 `Docker`
- 安装 `Docker Compose Plugin`
- 服务器已解析这 3 个域名到当前主机
- 已准备两套证书：
  - 主站证书：覆盖 `hi-shuaiqiang.me` 和 `www.hi-shuaiqiang.me`
  - API 证书：覆盖 `api.hi-shuaiqiang.me`

## 建议目录

建议把整个项目放在：

- `/opt/blog111/blog111`

证书使用服务器上的固定绝对路径：

- `/etc/nginx/certs/site/fullchain.pem`
- `/etc/nginx/certs/site/privkey.pem`
- `/etc/nginx/certs/api/fullchain.pem`
- `/etc/nginx/certs/api/privkey.pem`

这些证书文件不需要放进项目目录，`docker-compose.yml` 会直接把它们挂载给 `nginx` 容器。

## 环境变量

复制模板：

```bash
cp .env.example .env
```

建议至少修改这些值：

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `BLOG_BOOTSTRAP_ADMIN_PASSWORD`

其他默认值已经按当前项目写好，可以直接起步。

## 启动方式

在项目根目录执行：

```bash
docker compose up -d --build
```

第一次启动时会完成这些动作：

- 构建 `blog-api` 镜像
- 构建 `blog-web` 镜像
- 构建 `admin-web` 镜像
- 启动 `mysql`
- 后端启动时自动执行 `Flyway` 迁移
- 如果管理员账号不存在，则自动初始化默认管理员

## 容器职责

- `mysql`：数据库，数据持久化到 Docker volume
- `blog-api`：Spring Boot + MyBatis + Flyway
- `blog-web`：前台静态资源容器
- `admin-web`：后台静态资源容器
- `nginx`：统一接入 HTTPS、域名分发与 `/api` 代理

## Nginx 路由

- `hi-shuaiqiang.me`
  - `/` -> `blog-web`
  - `/api/` -> `blog-api`
- `www.hi-shuaiqiang.me`
  - 永久跳转到 `https://hi-shuaiqiang.me`
- `api.hi-shuaiqiang.me`
  - `/` -> `admin-web`
  - `/api/` -> `blog-api`

Nginx 配置文件见：

- [deploy/nginx/nginx.conf](../deploy/nginx/nginx.conf)
- [deploy/nginx/conf.d/blog111.conf](../deploy/nginx/conf.d/blog111.conf)

## 常用命令

查看容器状态：

```bash
docker compose ps
```

查看后端日志：

```bash
docker compose logs -f blog-api
```

查看 Nginx 日志：

```bash
docker compose logs -f nginx
```

重建并重启：

```bash
docker compose up -d --build
```

停止服务：

```bash
docker compose down
```

如果要连同数据库卷一起删除：

```bash
docker compose down -v
```

## 上线检查清单

- 3 个域名都已经正确解析到服务器
- 证书文件路径正确
- `.env` 已经替换默认密码
- `docker compose up -d --build` 成功
- `Flyway` 成功执行
- 管理员初始密码已替换
- `https://hi-shuaiqiang.me` 可访问
- `https://www.hi-shuaiqiang.me` 能跳到主站
- `https://api.hi-shuaiqiang.me` 可访问后台登录页
- 后台新增文章后，前台能看到已发布文章
- 反向代理下 `/api` 请求正常
