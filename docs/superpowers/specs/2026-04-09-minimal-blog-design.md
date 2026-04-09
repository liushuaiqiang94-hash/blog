# Minimal Blog Design

Date: 2026-04-09

## Overview

This project is a minimal blog system with separate public and admin experiences under two subdomains.

- Public site: blog subdomain for visitors
- Admin site: admin subdomain for the site owner
- Backend: Spring Boot
- Frontend: Vue
- Database: MySQL
- Database migration: Flyway

The first release is intentionally narrow. It only includes:

- Public home page
- Public post detail page
- Admin login
- Admin post management

The system stores post bodies as Markdown in the database and renders them on the public detail page.

## Goals

- Ship a small but complete blog product with clear separation between reading and management
- Support writing and managing Markdown posts from an admin interface
- Publish posts to the public site with a draft and published workflow
- Keep the architecture simple enough to build and deploy quickly

## Non-Goals

- Categories, tags, comments, likes, search, RSS, and multi-user authoring
- Rich text editing
- Scheduled publishing
- Media library
- Revision history
- Public API for third-party consumers

## Recommended Architecture

The recommended approach is three applications in one repository:

- `blog-web`: Vue app for the public blog
- `admin-web`: Vue app for the admin interface
- `blog-api`: Spring Boot application for authentication, post management, and public post queries

This matches the two-subdomain requirement cleanly while keeping backend logic centralized.

### Why this approach

- It maps naturally to `blog.<domain>` and `admin.<domain>`
- It keeps the public site and admin UI isolated from each other
- It allows both frontends to share one backend and one database
- It stays simple enough for a minimal first version

### Alternatives considered

1. Single Vue frontend for both public and admin pages plus one Spring Boot backend

This reduces the number of frontend projects but mixes two different experiences into one app. It is less natural for the two-subdomain setup and makes later maintenance messier.

2. Spring Boot rendered public pages plus Vue admin frontend

This can work, but it splits the frontend technology approach and increases implementation complexity for a small first release.

## Domain and Deployment Model

- `blog.<domain>` serves the public Vue app
- `admin.<domain>` serves the admin Vue app
- Both frontends call backend APIs under `/api`
- Nginx routes requests by subdomain and proxies `/api` to Spring Boot
- Spring Boot connects to MySQL and runs Flyway on startup

This design avoids introducing a third API domain and keeps deployment straightforward.

## User Experience Scope

### Public site

The public site has exactly two pages:

1. Home page
2. Post detail page

#### Home page

- Show published posts only
- Display title, summary, and published time
- Allow click-through to the post detail page

#### Post detail page

- Load a published post by slug
- Render Markdown content as HTML
- Return 404 if the post does not exist or is not published

### Admin site

The admin site includes exactly three views:

1. Login page
2. Post list page
3. Post editor page

#### Login page

- Single admin username and password
- Login required before accessing admin features

#### Post list page

- Show all posts regardless of status
- Distinguish draft and published states clearly
- Support create, edit, and delete actions

#### Post editor page

- Edit title
- Edit slug
- Edit summary
- Edit Markdown body
- Save as draft
- Publish

## Authentication Design

Authentication is single-admin only.

### Recommended mechanism

- Spring Security based authentication
- Session or server-managed login state
- `HttpOnly` cookie for browser authentication state

### Why not JWT first

JWT adds complexity that is not needed for a single-admin internal system. Session-based auth is simpler, safer for this scope, and easier to manage for login and logout.

## Data Model

The first version should use only two core tables.

### `admin_user`

- `id`
- `username`
- `password_hash`
- `created_at`
- `updated_at`

### `post`

- `id`
- `title`
- `slug`
- `summary`
- `content_markdown`
- `status` with values `DRAFT` and `PUBLISHED`
- `published_at`
- `created_at`
- `updated_at`

## Data Rules

- `slug` must be unique
- `title` is required
- `content_markdown` is required
- New posts default to `DRAFT`
- Public APIs must only expose `PUBLISHED` posts
- If a published post is moved back to draft, it disappears from public results
- `published_at` is set when a post is first published

## Markdown Handling

- The database stores raw Markdown in `content_markdown`
- The public post detail page renders Markdown to HTML
- Admin editing works against Markdown source, not rich text

This keeps authoring simple and aligns with the user's preference for note-style blogging.

## API Design

### Public APIs

- `GET /api/posts`
  - Return published post list
- `GET /api/posts/{slug}`
  - Return one published post by slug

### Admin APIs

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/posts`
- `GET /api/admin/posts/{id}`
- `POST /api/admin/posts`
- `PUT /api/admin/posts/{id}`
- `DELETE /api/admin/posts/{id}`

## Flyway Strategy

Flyway is required from the beginning.

### Rules

- Store migration files inside the Spring Boot project
- Create initial schema using Flyway, not manual database setup
- Use new migration files for every schema change
- Do not rewrite old migration files after they have been applied in shared environments

### Initial migration scope

The first migration should create:

- `admin_user`
- `post`
- required indexes and unique constraint for `slug`

### Admin bootstrap

The initial administrator will be created by a backend startup initialization path, not by a Flyway seed record.

Rules:

- Flyway creates schema only
- Spring Boot checks whether an admin user exists during startup
- If no admin exists, Spring Boot creates one from configured bootstrap credentials
- The bootstrap password must be stored as a hash in the database

This keeps migrations deterministic while avoiding hardcoded admin credentials in SQL files.

## Publishing Workflow

The publishing flow stays intentionally small:

1. Admin creates a post
2. Post starts in `DRAFT`
3. Admin saves draft changes as needed
4. Admin publishes the post
5. Public site shows the post once it is `PUBLISHED`
6. Admin can move a post back to draft to remove it from the public site

## Error Handling

### Public site

- Return 404 for missing posts
- Treat draft posts as not found on public APIs

### Admin site

- Return 401 for unauthenticated admin API access
- Return validation errors for missing title or body
- Return a clear error when `slug` is duplicated

## Testing Scope

This minimal version still needs targeted tests.

### Backend

- Authentication success and failure
- Admin post create, update, delete
- Public APIs return published posts only
- Draft posts are not accessible publicly
- Flyway migrations run successfully on startup

### Frontend

- Public home page renders post list
- Public detail page renders Markdown content
- Admin login flow works
- Admin can create and edit a post

## Project Structure

The repository should be organized like this:

```text
blog111/
  blog-web/
  admin-web/
  blog-api/
  docs/
    superpowers/
      specs/
```

## Implementation Boundaries

The first implementation should avoid expanding scope beyond the approved minimal product.

Keep:

- Two public pages
- Admin login
- Admin post management
- Markdown storage
- Draft and published status
- Flyway-backed schema management

Do not add in the first pass:

- Tag systems
- Search
- Pagination unless it becomes necessary for basic usability
- File uploads
- Multiple admin roles

## Open Decisions Resolved In This Spec

The following decisions are fixed for implementation:

- Frontend uses Vue
- Backend uses Spring Boot
- Database uses MySQL
- Content is Markdown stored in the database
- Authentication is a single admin username and password
- Post statuses are `DRAFT` and `PUBLISHED`
- Schema management uses Flyway
- Public and admin sites use separate subdomains

## Success Criteria

The first release is successful when:

- Visitors can open the public home page and see published posts
- Visitors can open a post detail page and read rendered Markdown content
- The site owner can log in to the admin site
- The site owner can create, edit, publish, draft, and delete posts
- Database schema is managed by Flyway
- Deployment works cleanly with one public subdomain and one admin subdomain
