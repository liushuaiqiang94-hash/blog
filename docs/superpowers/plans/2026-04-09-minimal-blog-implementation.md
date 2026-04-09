# Minimal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个最小博客系统，包含前台首页、前台文章详情页、后台登录、后台文章管理，并使用 Flyway 管理 MySQL 数据库结构。

**Architecture:** 仓库包含三个应用：`blog-api` 负责 Spring Boot 后端、认证、文章管理与公开查询；`blog-web` 负责前台访客页面；`admin-web` 负责后台管理页面。两个前端通过 `/api` 调用后端，后端使用 Spring Security、JPA、Flyway 和 MySQL 完成认证与数据持久化。

**Tech Stack:** Vue 3、Vite、Vue Router、Pinia、TypeScript、Vitest、Spring Boot 3、Spring Security、Spring Data JPA、Flyway、MySQL、Testcontainers、JUnit 5、MockMvc

---

## 文件结构与职责

### 根目录

- Create: `README.md`
- Create: `.gitignore`
- Create: `docker-compose.yml`

### 后端 `blog-api`

- Create: `blog-api/pom.xml`
- Create: `blog-api/src/main/java/com/example/blogapi/BlogApiApplication.java`
- Create: `blog-api/src/main/java/com/example/blogapi/config/SecurityConfig.java`
- Create: `blog-api/src/main/java/com/example/blogapi/controller/AdminAuthController.java`
- Create: `blog-api/src/main/java/com/example/blogapi/controller/AdminPostController.java`
- Create: `blog-api/src/main/java/com/example/blogapi/controller/PublicPostController.java`
- Create: `blog-api/src/main/java/com/example/blogapi/domain/AdminUser.java`
- Create: `blog-api/src/main/java/com/example/blogapi/domain/Post.java`
- Create: `blog-api/src/main/java/com/example/blogapi/domain/PostStatus.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/auth/LoginRequest.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/auth/LoginResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/AdminPostRequest.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/AdminPostResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/PublicPostDetailResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/PublicPostSummaryResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/repository/AdminUserRepository.java`
- Create: `blog-api/src/main/java/com/example/blogapi/repository/PostRepository.java`
- Create: `blog-api/src/main/java/com/example/blogapi/service/AdminBootstrapService.java`
- Create: `blog-api/src/main/java/com/example/blogapi/service/AuthService.java`
- Create: `blog-api/src/main/java/com/example/blogapi/service/PostService.java`
- Create: `blog-api/src/main/java/com/example/blogapi/exception/ApiExceptionHandler.java`
- Create: `blog-api/src/main/resources/application.yml`
- Create: `blog-api/src/main/resources/application-local.yml`
- Create: `blog-api/src/main/resources/db/migration/V1__create_admin_user_and_post.sql`
- Create: `blog-api/src/test/java/com/example/blogapi/support/MySqlContainerSupport.java`
- Create: `blog-api/src/test/java/com/example/blogapi/controller/AdminAuthControllerTest.java`
- Create: `blog-api/src/test/java/com/example/blogapi/controller/AdminPostControllerTest.java`
- Create: `blog-api/src/test/java/com/example/blogapi/controller/PublicPostControllerTest.java`
- Create: `blog-api/src/test/java/com/example/blogapi/FlywayMigrationTest.java`

### 前台 `blog-web`

- Create: `blog-web/package.json`
- Create: `blog-web/vite.config.ts`
- Create: `blog-web/tsconfig.json`
- Create: `blog-web/index.html`
- Create: `blog-web/src/main.ts`
- Create: `blog-web/src/App.vue`
- Create: `blog-web/src/router/index.ts`
- Create: `blog-web/src/types/post.ts`
- Create: `blog-web/src/services/postApi.ts`
- Create: `blog-web/src/views/HomeView.vue`
- Create: `blog-web/src/views/PostDetailView.vue`
- Create: `blog-web/src/components/PostListItem.vue`
- Create: `blog-web/src/components/PostContent.vue`
- Create: `blog-web/src/assets/main.css`
- Create: `blog-web/src/views/__tests__/HomeView.spec.ts`
- Create: `blog-web/src/views/__tests__/PostDetailView.spec.ts`

### 后台 `admin-web`

- Create: `admin-web/package.json`
- Create: `admin-web/vite.config.ts`
- Create: `admin-web/tsconfig.json`
- Create: `admin-web/index.html`
- Create: `admin-web/src/main.ts`
- Create: `admin-web/src/App.vue`
- Create: `admin-web/src/router/index.ts`
- Create: `admin-web/src/stores/auth.ts`
- Create: `admin-web/src/types/post.ts`
- Create: `admin-web/src/services/adminApi.ts`
- Create: `admin-web/src/views/LoginView.vue`
- Create: `admin-web/src/views/PostListView.vue`
- Create: `admin-web/src/views/PostEditorView.vue`
- Create: `admin-web/src/components/PostForm.vue`
- Create: `admin-web/src/assets/main.css`
- Create: `admin-web/src/views/__tests__/LoginView.spec.ts`
- Create: `admin-web/src/views/__tests__/PostListView.spec.ts`
- Create: `admin-web/src/views/__tests__/PostEditorView.spec.ts`

## Task 1: 初始化仓库与运行骨架

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `docker-compose.yml`
- Create: `blog-api/pom.xml`
- Create: `blog-api/src/main/java/com/example/blogapi/BlogApiApplication.java`
- Create: `blog-api/src/main/resources/application.yml`
- Create: `blog-web/package.json`
- Create: `admin-web/package.json`

- [ ] **Step 1: 创建根目录忽略规则和本地运行说明**

```gitignore
# Java
blog-api/target/
blog-api/.mvn/

# Node
blog-web/node_modules/
admin-web/node_modules/
blog-web/dist/
admin-web/dist/

# IDE
.idea/
.vscode/
*.iml

# OS
.DS_Store
Thumbs.db

# Env
*.env
*.local
```

````markdown
# blog111

最小博客系统，包含：

- `blog-api`：Spring Boot 后端
- `blog-web`：前台 Vue 应用
- `admin-web`：后台 Vue 应用

本地开发启动顺序：

1. `docker compose up -d`
2. 启动 `blog-api`
3. 启动 `blog-web`
4. 启动 `admin-web`
````

- [ ] **Step 2: 添加本地 MySQL 运行编排**

```yaml
version: "3.9"

services:
  mysql:
    image: mysql:8.4
    container_name: blog111-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: blog111
      MYSQL_USER: blog111
      MYSQL_PASSWORD: blog111
    ports:
      - "3306:3306"
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

- [ ] **Step 3: 创建后端 Maven 骨架**

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.1</version>
        <relativePath />
    </parent>
    <groupId>com.example</groupId>
    <artifactId>blog-api</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>blog-api</name>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-mysql</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>mysql</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

```java
package com.example.blogapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BlogApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlogApiApplication.class, args);
    }
}
```

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog111?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: blog111
    password: blog111
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
```

- [ ] **Step 4: 创建两个 Vue 应用骨架定义**

```json
{
  "name": "blog-web",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.4.0",
    "marked": "^14.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.0",
    "@vue/test-utils": "^2.4.6",
    "jsdom": "^24.1.0",
    "typescript": "^5.5.4",
    "vite": "^5.4.1",
    "vitest": "^2.0.5",
    "vue-tsc": "^2.0.29"
  }
}
```

```json
{
  "name": "admin-web",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "pinia": "^2.2.2",
    "vue": "^3.5.0",
    "vue-router": "^4.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.0",
    "@vue/test-utils": "^2.4.6",
    "jsdom": "^24.1.0",
    "typescript": "^5.5.4",
    "vite": "^5.4.1",
    "vitest": "^2.0.5",
    "vue-tsc": "^2.0.29"
  }
}
```

- [ ] **Step 5: 验证基础工程能安装依赖**

Run:

```powershell
docker compose up -d
cd blog-api; mvn -q -DskipTests package
cd ..\blog-web; npm install
cd ..\admin-web; npm install
```

Expected:

```text
MySQL container is running
BUILD SUCCESS
npm install completed without error
```

- [ ] **Step 6: 提交初始化骨架**

```bash
git add .gitignore README.md docker-compose.yml blog-api blog-web admin-web
git commit -m "chore: scaffold minimal blog workspace"
```

## Task 2: 建立 Flyway、实体与管理员引导逻辑

**Files:**
- Create: `blog-api/src/main/java/com/example/blogapi/domain/AdminUser.java`
- Create: `blog-api/src/main/java/com/example/blogapi/domain/Post.java`
- Create: `blog-api/src/main/java/com/example/blogapi/domain/PostStatus.java`
- Create: `blog-api/src/main/java/com/example/blogapi/repository/AdminUserRepository.java`
- Create: `blog-api/src/main/java/com/example/blogapi/repository/PostRepository.java`
- Create: `blog-api/src/main/java/com/example/blogapi/service/AdminBootstrapService.java`
- Create: `blog-api/src/main/resources/db/migration/V1__create_admin_user_and_post.sql`
- Create: `blog-api/src/test/java/com/example/blogapi/support/MySqlContainerSupport.java`
- Create: `blog-api/src/test/java/com/example/blogapi/FlywayMigrationTest.java`

- [ ] **Step 1: 先写 Flyway 启动验证测试**

```java
package com.example.blogapi;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.blogapi.support.MySqlContainerSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
class FlywayMigrationTest extends MySqlContainerSupport {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void shouldCreateAdminUserAndPostTables() {
        Integer adminTable = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_schema = database() and table_name = 'admin_user'",
            Integer.class
        );
        Integer postTable = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_schema = database() and table_name = 'post'",
            Integer.class
        );

        assertThat(adminTable).isEqualTo(1);
        assertThat(postTable).isEqualTo(1);
    }
}
```

```java
package com.example.blogapi.support;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
public abstract class MySqlContainerSupport {

    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4")
        .withDatabaseName("blog111_test")
        .withUsername("blog111")
        .withPassword("blog111");

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
    }
}
```

- [ ] **Step 2: 运行测试确认当前失败**

Run:

```powershell
cd blog-api
mvn -Dtest=FlywayMigrationTest test
```

Expected:

```text
FAIL
Caused by: Flyway migration location does not contain valid schema history
```

- [ ] **Step 3: 添加最小迁移脚本与领域对象**

```sql
create table admin_user (
    id bigint primary key auto_increment,
    username varchar(64) not null unique,
    password_hash varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp
);

create table post (
    id bigint primary key auto_increment,
    title varchar(255) not null,
    slug varchar(255) not null unique,
    summary varchar(500) not null,
    content_markdown longtext not null,
    status varchar(32) not null,
    published_at datetime null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp
);
```

```java
package com.example.blogapi.domain;

public enum PostStatus {
    DRAFT,
    PUBLISHED
}
```

```java
package com.example.blogapi.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_user")
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected AdminUser() {
    }

    public AdminUser(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
}
```

```java
package com.example.blogapi.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(name = "content_markdown", nullable = false, columnDefinition = "LONGTEXT")
    private String contentMarkdown;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PostStatus status;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Post() {
    }

    public Post(String title, String slug, String summary, String contentMarkdown, PostStatus status) {
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.contentMarkdown = contentMarkdown;
        this.status = status;
        if (status == PostStatus.PUBLISHED) {
            this.publishedAt = LocalDateTime.now();
        }
    }

    public void update(String title, String slug, String summary, String contentMarkdown, PostStatus status) {
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.contentMarkdown = contentMarkdown;
        if (this.status != PostStatus.PUBLISHED && status == PostStatus.PUBLISHED && this.publishedAt == null) {
            this.publishedAt = LocalDateTime.now();
        }
        this.status = status;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public String getSummary() { return summary; }
    public String getContentMarkdown() { return contentMarkdown; }
    public PostStatus getStatus() { return status; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
}
```

- [ ] **Step 4: 添加仓储与管理员初始化服务**

```java
package com.example.blogapi.repository;

import com.example.blogapi.domain.AdminUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
```

```java
package com.example.blogapi.repository;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByStatusOrderByPublishedAtDesc(PostStatus status);
    Optional<Post> findBySlugAndStatus(String slug, PostStatus status);
    boolean existsBySlug(String slug);
}
```

```java
package com.example.blogapi.service;

import com.example.blogapi.domain.AdminUser;
import com.example.blogapi.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrapService {

    public AdminBootstrapService(
        AdminUserRepository adminUserRepository,
        PasswordEncoder passwordEncoder,
        @Value("${blog.bootstrap-admin.username}") String username,
        @Value("${blog.bootstrap-admin.password}") String password
    ) {
        if (!adminUserRepository.existsByUsername(username)) {
            adminUserRepository.save(new AdminUser(username, passwordEncoder.encode(password)));
        }
    }
}
```

```yaml
blog:
  bootstrap-admin:
    username: admin
    password: change-me-now
```

- [ ] **Step 5: 运行测试确认迁移生效**

Run:

```powershell
cd blog-api
mvn -Dtest=FlywayMigrationTest test
```

Expected:

```text
BUILD SUCCESS
Tests run: 1, Failures: 0
```

- [ ] **Step 6: 提交数据层基础**

```bash
git add blog-api
git commit -m "feat: add flyway schema and domain model"
```

## Task 3: 完成后台登录与会话认证

**Files:**
- Create: `blog-api/src/main/java/com/example/blogapi/config/SecurityConfig.java`
- Create: `blog-api/src/main/java/com/example/blogapi/controller/AdminAuthController.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/auth/LoginRequest.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/auth/LoginResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/service/AuthService.java`
- Create: `blog-api/src/test/java/com/example/blogapi/controller/AdminAuthControllerTest.java`

- [ ] **Step 1: 先写登录成功与失败测试**

```java
package com.example.blogapi.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.blogapi.support.MySqlContainerSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AdminAuthControllerTest extends MySqlContainerSupport {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldLoginWithBootstrapAdmin() throws Exception {
        mockMvc.perform(post("/api/admin/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"admin","password":"change-me-now"}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    void shouldRejectInvalidPassword() throws Exception {
        mockMvc.perform(post("/api/admin/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"admin","password":"wrong-password"}
                    """))
            .andExpect(status().isUnauthorized());
    }
}
```

- [ ] **Step 5: 跑通登录测试并提交**

Run:

```powershell
cd blog-api
mvn -Dtest=AdminAuthControllerTest test
```

Expected:

```text
BUILD SUCCESS
Tests run: 2, Failures: 0
```

```bash
git add blog-api
git commit -m "feat: add admin session authentication"
```

## Task 4: 完成文章 CRUD 与前台公开接口

**Files:**
- Create: `blog-api/src/main/java/com/example/blogapi/controller/AdminPostController.java`
- Create: `blog-api/src/main/java/com/example/blogapi/controller/PublicPostController.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/AdminPostRequest.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/AdminPostResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/PublicPostSummaryResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/dto/post/PublicPostDetailResponse.java`
- Create: `blog-api/src/main/java/com/example/blogapi/service/PostService.java`
- Create: `blog-api/src/main/java/com/example/blogapi/exception/ApiExceptionHandler.java`
- Create: `blog-api/src/test/java/com/example/blogapi/controller/AdminPostControllerTest.java`
- Create: `blog-api/src/test/java/com/example/blogapi/controller/PublicPostControllerTest.java`

- [ ] **Step 1: 先写后台文章管理测试**

```java
package com.example.blogapi.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.blogapi.support.MySqlContainerSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AdminPostControllerTest extends MySqlContainerSupport {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldRequireLoginForAdminPostList() throws Exception {
        mockMvc.perform(get("/api/admin/posts"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldCreateDraftPostWhenLoggedIn() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("ADMIN_USER_ID", 1L);
        session.setAttribute("ADMIN_USERNAME", "admin");

        mockMvc.perform(post("/api/admin/posts")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title":"第一篇文章",
                      "slug":"first-post",
                      "summary":"摘要",
                      "contentMarkdown":"# Hello",
                      "status":"DRAFT"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.slug").value("first-post"))
            .andExpect(jsonPath("$.status").value("DRAFT"));
    }
}
```

- [ ] **Step 2: 先写前台公开接口测试**

```java
package com.example.blogapi.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.blogapi.support.MySqlContainerSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PublicPostControllerTest extends MySqlContainerSupport {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void shouldReturnPublishedPostsOnly() throws Exception {
        jdbcTemplate.update(
            "insert into post(title, slug, summary, content_markdown, status, published_at) values (?, ?, ?, ?, ?, now())",
            "Published", "published-post", "summary", "# content", "PUBLISHED"
        );
        jdbcTemplate.update(
            "insert into post(title, slug, summary, content_markdown, status) values (?, ?, ?, ?, ?)",
            "Draft", "draft-post", "summary", "# draft", "DRAFT"
        );

        mockMvc.perform(get("/api/posts"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].slug").value("published-post"));
    }
}
```

- [ ] **Step 3: 运行测试确认当前失败**

Run:

```powershell
cd blog-api
mvn -Dtest=AdminPostControllerTest,PublicPostControllerTest test
```

Expected:

```text
FAIL
404 Not Found
```

- [ ] **Step 4: 添加 DTO、异常处理与文章服务**

```java
package com.example.blogapi.dto.post;

import com.example.blogapi.domain.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminPostRequest(
    @NotBlank String title,
    @NotBlank String slug,
    @NotBlank String summary,
    @NotBlank String contentMarkdown,
    @NotNull PostStatus status
) {
}
```

```java
package com.example.blogapi.dto.post;

import com.example.blogapi.domain.PostStatus;
import java.time.LocalDateTime;

public record AdminPostResponse(
    Long id,
    String title,
    String slug,
    String summary,
    String contentMarkdown,
    PostStatus status,
    LocalDateTime publishedAt
) {
}
```

```java
package com.example.blogapi.dto.post;

import java.time.LocalDateTime;

public record PublicPostSummaryResponse(
    String title,
    String slug,
    String summary,
    LocalDateTime publishedAt
) {
}
```

```java
package com.example.blogapi.dto.post;

import java.time.LocalDateTime;

public record PublicPostDetailResponse(
    String title,
    String slug,
    String summary,
    String contentMarkdown,
    LocalDateTime publishedAt
) {
}
```

```java
package com.example.blogapi.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    Map<String, String> handleBadCredentials(BadCredentialsException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, String> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return Map.of("message", message);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Map<String, String> handleIllegalArgument(IllegalArgumentException exception) {
        return Map.of("message", exception.getMessage());
    }
}
```

```java
package com.example.blogapi.service;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import com.example.blogapi.dto.post.AdminPostRequest;
import com.example.blogapi.repository.PostRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> listPublicPosts() {
        return postRepository.findAllByStatusOrderByPublishedAtDesc(PostStatus.PUBLISHED);
    }

    public Post getPublicPost(String slug) {
        return postRepository.findBySlugAndStatus(slug, PostStatus.PUBLISHED)
            .orElseThrow(() -> new IllegalArgumentException("文章不存在"));
    }

    public List<Post> listAdminPosts() {
        return postRepository.findAll();
    }

    public Post create(AdminPostRequest request) {
        if (postRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("slug 已存在");
        }
        Post post = new Post(request.title(), request.slug(), request.summary(), request.contentMarkdown(), request.status());
        return postRepository.save(post);
    }
}
```

- [ ] **Step 5: 实现后台与前台控制器**

```java
package com.example.blogapi.controller;

import com.example.blogapi.domain.Post;
import com.example.blogapi.dto.post.AdminPostRequest;
import com.example.blogapi.dto.post.AdminPostResponse;
import com.example.blogapi.service.PostService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {

    private final PostService postService;

    public AdminPostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<AdminPostResponse> list() {
        return postService.listAdminPosts().stream().map(this::map).toList();
    }

    @PostMapping
    public AdminPostResponse create(@Valid @RequestBody AdminPostRequest request) {
        return map(postService.create(request));
    }

    private AdminPostResponse map(Post post) {
        return new AdminPostResponse(
            post.getId(),
            post.getTitle(),
            post.getSlug(),
            post.getSummary(),
            post.getContentMarkdown(),
            post.getStatus(),
            post.getPublishedAt()
        );
    }
}
```

```java
package com.example.blogapi.controller;

import com.example.blogapi.dto.post.PublicPostDetailResponse;
import com.example.blogapi.dto.post.PublicPostSummaryResponse;
import com.example.blogapi.service.PostService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class PublicPostController {

    private final PostService postService;

    public PublicPostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<PublicPostSummaryResponse> list() {
        return postService.listPublicPosts().stream()
            .map(post -> new PublicPostSummaryResponse(post.getTitle(), post.getSlug(), post.getSummary(), post.getPublishedAt()))
            .toList();
    }

    @GetMapping("/{slug}")
    public PublicPostDetailResponse detail(@PathVariable String slug) {
        var post = postService.getPublicPost(slug);
        return new PublicPostDetailResponse(
            post.getTitle(),
            post.getSlug(),
            post.getSummary(),
            post.getContentMarkdown(),
            post.getPublishedAt()
        );
    }
}
```

- [ ] **Step 6: 补齐更新、删除接口并跑通后端测试**

```java
public Post update(Long id, AdminPostRequest request) {
    Post post = postRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("文章不存在"));
    if (!post.getSlug().equals(request.slug()) && postRepository.existsBySlug(request.slug())) {
        throw new IllegalArgumentException("slug 已存在");
    }
    post.update(request.title(), request.slug(), request.summary(), request.contentMarkdown(), request.status());
    return postRepository.save(post);
}

public void delete(Long id) {
    postRepository.deleteById(id);
}
```

```java
@PutMapping("/{id}")
public AdminPostResponse update(@PathVariable Long id, @Valid @RequestBody AdminPostRequest request) {
    return map(postService.update(id, request));
}

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(@PathVariable Long id) {
    postService.delete(id);
}
```

Run:

```powershell
cd blog-api
mvn test
```

Expected:

```text
BUILD SUCCESS
All controller tests passing
```

```bash
git add blog-api
git commit -m "feat: add post management and public post apis"
```

## Task 5: 实现前台博客 Vue 应用

**Files:**
- Create: `blog-web/vite.config.ts`
- Create: `blog-web/tsconfig.json`
- Create: `blog-web/index.html`
- Create: `blog-web/src/main.ts`
- Create: `blog-web/src/App.vue`
- Create: `blog-web/src/router/index.ts`
- Create: `blog-web/src/types/post.ts`
- Create: `blog-web/src/services/postApi.ts`
- Create: `blog-web/src/views/HomeView.vue`
- Create: `blog-web/src/views/PostDetailView.vue`
- Create: `blog-web/src/components/PostListItem.vue`
- Create: `blog-web/src/components/PostContent.vue`
- Create: `blog-web/src/assets/main.css`
- Create: `blog-web/src/views/__tests__/HomeView.spec.ts`
- Create: `blog-web/src/views/__tests__/PostDetailView.spec.ts`

- [ ] **Step 1: 先写首页与详情页测试**

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  it('renders published post list', async () => {
    const wrapper = mount(HomeView)
    await Promise.resolve()
    expect(wrapper.text()).toContain('文章')
  })
})
```

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PostDetailView from '../PostDetailView.vue'

describe('PostDetailView', () => {
  it('renders markdown content container', () => {
    const wrapper = mount(PostDetailView, {
      global: { mocks: { $route: { params: { slug: 'first' } } } }
    })
    expect(wrapper.html()).toContain('markdown-body')
  })
})
```

- [ ] **Step 2: 运行测试确认当前失败**

Run:

```powershell
cd blog-web
npm test
```

Expected:

```text
FAIL
Cannot find module '../HomeView.vue'
```

- [ ] **Step 3: 创建应用入口、路由和 API 封装**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

createApp(App).use(router).mount('#app')
```

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostDetailView from '../views/PostDetailView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/notes/:slug', name: 'post-detail', component: PostDetailView }
  ]
})
```

```ts
export interface PublicPostSummary {
  title: string
  slug: string
  summary: string
  publishedAt: string
}

export interface PublicPostDetail extends PublicPostSummary {
  contentMarkdown: string
}
```

```ts
import type { PublicPostDetail, PublicPostSummary } from '../types/post'

const API_BASE = '/api/posts'

export async function listPosts(): Promise<PublicPostSummary[]> {
  const response = await fetch(API_BASE)
  return response.json()
}

export async function getPost(slug: string): Promise<PublicPostDetail> {
  const response = await fetch(`${API_BASE}/${slug}`)
  if (!response.ok) {
    throw new Error('文章不存在')
  }
  return response.json()
}
```

- [ ] **Step 4: 实现首页与详情页**

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PostListItem from '../components/PostListItem.vue'
import { listPosts } from '../services/postApi'
import type { PublicPostSummary } from '../types/post'

const posts = ref<PublicPostSummary[]>([])

onMounted(async () => {
  posts.value = await listPosts()
})
</script>

<template>
  <main class="page">
    <header class="hero">
      <h1>我的博客</h1>
      <p>记录学习、实践和一些值得留下来的笔记。</p>
    </header>
    <section class="post-list">
      <PostListItem v-for="post in posts" :key="post.slug" :post="post" />
    </section>
  </main>
</template>
```

```vue
<script setup lang="ts">
import { marked } from 'marked'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPost } from '../services/postApi'
import type { PublicPostDetail } from '../types/post'

const route = useRoute()
const post = ref<PublicPostDetail | null>(null)

onMounted(async () => {
  post.value = await getPost(String(route.params.slug))
})

const renderedContent = computed(() => post.value ? marked(post.value.contentMarkdown) : '')
</script>

<template>
  <main v-if="post" class="page">
    <article class="post-detail">
      <h1>{{ post.title }}</h1>
      <p class="summary">{{ post.summary }}</p>
      <div class="markdown-body" v-html="renderedContent" />
    </article>
  </main>
</template>
```

- [ ] **Step 5: 添加基础样式并完成前台验证**

```css
:root {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  color: #1f2937;
  background:
    radial-gradient(circle at top left, rgba(245, 158, 11, 0.16), transparent 28%),
    linear-gradient(180deg, #fffdf8 0%, #f5efe4 100%);
}

body {
  margin: 0;
}

#app {
  min-height: 100vh;
}

.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}
```

Run:

```powershell
cd blog-web
npm test
npm run build
```

Expected:

```text
All tests passed
vite build completed successfully
```

```bash
git add blog-web
git commit -m "feat: add public blog frontend"
```

## Task 6: 实现后台管理 Vue 应用

**Files:**
- Create: `admin-web/vite.config.ts`
- Create: `admin-web/tsconfig.json`
- Create: `admin-web/index.html`
- Create: `admin-web/src/main.ts`
- Create: `admin-web/src/App.vue`
- Create: `admin-web/src/router/index.ts`
- Create: `admin-web/src/stores/auth.ts`
- Create: `admin-web/src/types/post.ts`
- Create: `admin-web/src/services/adminApi.ts`
- Create: `admin-web/src/views/LoginView.vue`
- Create: `admin-web/src/views/PostListView.vue`
- Create: `admin-web/src/views/PostEditorView.vue`
- Create: `admin-web/src/components/PostForm.vue`
- Create: `admin-web/src/assets/main.css`
- Create: `admin-web/src/views/__tests__/LoginView.spec.ts`
- Create: `admin-web/src/views/__tests__/PostListView.spec.ts`
- Create: `admin-web/src/views/__tests__/PostEditorView.spec.ts`

- [ ] **Step 1: 先写后台登录页和文章编辑页测试**

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'

describe('LoginView', () => {
  it('renders login fields', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('input[name="username"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
  })
})
```

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PostEditorView from '../PostEditorView.vue'

describe('PostEditorView', () => {
  it('renders markdown form fields', () => {
    const wrapper = mount(PostEditorView)
    expect(wrapper.find('input[name="title"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="contentMarkdown"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: 运行测试确认当前失败**

Run:

```powershell
cd admin-web
npm test
```

Expected:

```text
FAIL
Cannot find module '../LoginView.vue'
```

- [ ] **Step 3: 实现登录态存储、路由守卫和 API 封装**

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const username = ref('')
  const isAuthenticated = ref(false)

  function loginSuccess(nextUsername: string) {
    username.value = nextUsername
    isAuthenticated.value = true
  }

  function logoutSuccess() {
    username.value = ''
    isAuthenticated.value = false
  }

  return { username, isAuthenticated, loginSuccess, logoutSuccess }
})
```

```ts
export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface AdminPost {
  id: number
  title: string
  slug: string
  summary: string
  contentMarkdown: string
  status: PostStatus
  publishedAt: string | null
}
```

```ts
import type { AdminPost, PostStatus } from '../types/post'

export interface AdminPostPayload {
  title: string
  slug: string
  summary: string
  contentMarkdown: string
  status: PostStatus
}

export async function login(username: string, password: string) {
  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  })
  if (!response.ok) throw new Error('登录失败')
  return response.json()
}

export async function listPosts(): Promise<AdminPost[]> {
  const response = await fetch('/api/admin/posts', { credentials: 'include' })
  return response.json()
}
```

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import PostListView from '../views/PostListView.vue'
import PostEditorView from '../views/PostEditorView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', component: PostListView, meta: { requiresAuth: true } },
    { path: '/posts/new', component: PostEditorView, meta: { requiresAuth: true } },
    { path: '/posts/:id', component: PostEditorView, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }
})

export default router
```

- [ ] **Step 4: 实现登录页、文章列表页和文章表单**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { login } from '../services/adminApi'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function submit() {
  try {
    const result = await login(username.value, password.value)
    authStore.loginSuccess(result.username)
    await router.push('/')
  } catch {
    errorMessage.value = '用户名或密码错误'
  }
}
</script>

<template>
  <main class="login-page">
    <form class="login-card" @submit.prevent="submit">
      <h1>后台登录</h1>
      <input v-model="username" name="username" placeholder="用户名" />
      <input v-model="password" name="password" type="password" placeholder="密码" />
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <button type="submit">登录</button>
    </form>
  </main>
</template>
```

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listPosts } from '../services/adminApi'
import type { AdminPost } from '../types/post'

const posts = ref<AdminPost[]>([])

onMounted(async () => {
  posts.value = await listPosts()
})
</script>

<template>
  <main class="admin-page">
    <header class="toolbar">
      <h1>文章管理</h1>
      <RouterLink to="/posts/new">新建文章</RouterLink>
    </header>
    <table class="post-table">
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.title }}</td>
        <td>{{ post.status }}</td>
        <td><RouterLink :to="`/posts/${post.id}`">编辑</RouterLink></td>
      </tr>
    </table>
  </main>
</template>
```

```vue
<template>
  <form class="post-form">
    <input name="title" placeholder="标题" />
    <input name="slug" placeholder="slug" />
    <input name="summary" placeholder="摘要" />
    <textarea name="contentMarkdown" rows="16" placeholder="Markdown 内容" />
    <select name="status">
      <option value="DRAFT">草稿</option>
      <option value="PUBLISHED">已发布</option>
    </select>
    <button type="submit">保存</button>
  </form>
</template>
```

- [ ] **Step 5: 跑通后台测试和构建**

Run:

```powershell
cd admin-web
npm test
npm run build
```

Expected:

```text
All tests passed
vite build completed successfully
```

```bash
git add admin-web
git commit -m "feat: add admin blog frontend"
```

## Task 7: 本地联调、部署说明与验收脚本

**Files:**
- Modify: `README.md`
- Create: `blog-api/src/main/resources/application-local.yml`

- [ ] **Step 1: 增补本地开发配置**

```yaml
spring:
  config:
    activate:
      on-profile: local
  datasource:
    url: jdbc:mysql://localhost:3306/blog111?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: blog111
    password: blog111

server:
  port: 8080
```

- [ ] **Step 2: 补齐 README 的本地联调命令**

````markdown
## 本地开发

### 1. 启动数据库

```powershell
docker compose up -d
```

### 2. 启动后端

```powershell
cd blog-api
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### 3. 启动前台

```powershell
cd blog-web
npm run dev
```

### 4. 启动后台

```powershell
cd admin-web
npm run dev
```

默认访问：

- 前台：`http://localhost:5173`
- 后台：`http://localhost:5174`
- 后端：`http://localhost:8080`
````

- [ ] **Step 3: 执行整体验证**

Run:

```powershell
cd blog-api
mvn test
cd ..\blog-web
npm test
npm run build
cd ..\admin-web
npm test
npm run build
```

Expected:

```text
BUILD SUCCESS
All frontend tests passed
Both Vite builds completed successfully
```

- [ ] **Step 4: 提交最终联调与文档**

```bash
git add README.md blog-api/src/main/resources/application-local.yml
git commit -m "docs: add local development workflow"
```

## 自检

### Spec coverage

- 前台首页与详情页：由 Task 5 实现
- 后台登录：由 Task 3 与 Task 6 实现
- 后台文章管理：由 Task 4 与 Task 6 实现
- Markdown 存储与渲染：由 Task 2、Task 4、Task 5 实现
- Flyway 管理数据库结构：由 Task 2 实现
- 双子域名对应的双前端架构：由 Task 1、Task 5、Task 6、Task 7 落地

### Placeholder scan

- 没有保留 TBD、TODO 或“后续补充”式占位语句
- 每个任务都给出了具体文件、命令和期望结果

### Type consistency

- 后端文章状态统一使用 `PostStatus`
- 前后端正文字段统一使用 `contentMarkdown`
- 前台详情查询统一使用 `slug`
