package com.example.blogapi.service;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import com.example.blogapi.dto.post.AdminPostRequest;
import com.example.blogapi.dto.post.AdminPostResponse;
import com.example.blogapi.dto.post.PublicPostDetailResponse;
import com.example.blogapi.dto.post.PublicPostSummaryResponse;
import com.example.blogapi.mapper.PostMapper;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PostService {

    private final PostMapper postMapper;

    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    public List<PublicPostSummaryResponse> listPublicPosts() {
        return postMapper.findAllByStatusOrderByPublishedAtDesc(PostStatus.PUBLISHED)
                .stream()
                .map(PublicPostSummaryResponse::from)
                .toList();
    }

    public PublicPostDetailResponse getPublicPost(String slug) {
        return PublicPostDetailResponse.from(findPublishedPost(slug));
    }

    public List<AdminPostResponse> listAdminPosts() {
        return postMapper.findAllOrderByCreatedAtDesc()
                .stream()
                .map(AdminPostResponse::from)
                .toList();
    }

    public AdminPostResponse getAdminPost(Long id) {
        return AdminPostResponse.from(findPostById(id));
    }

    @Transactional
    public AdminPostResponse createPost(AdminPostRequest request) {
        ensureSlugIsAvailable(request.slug(), null);

        Post post = new Post();
        post.setSlug(request.slug());
        post.setTitle(request.title());
        post.setSummary(request.summary());
        post.setContentMarkdown(request.contentMarkdown());
        post.setStatus(request.status());
        if (request.status() == PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }

        postMapper.insert(post);
        return AdminPostResponse.from(findPostById(post.getId()));
    }

    @Transactional
    public AdminPostResponse updatePost(Long id, AdminPostRequest request) {
        Post existing = findPostById(id);
        ensureSlugIsAvailable(request.slug(), id);

        existing.setSlug(request.slug());
        existing.setTitle(request.title());
        existing.setSummary(request.summary());
        existing.setContentMarkdown(request.contentMarkdown());
        if (request.status() == PostStatus.PUBLISHED) {
            if (existing.getPublishedAt() == null) {
                existing.setPublishedAt(LocalDateTime.now());
            }
        }
        existing.setStatus(request.status());

        postMapper.update(existing);
        return AdminPostResponse.from(findPostById(id));
    }

    @Transactional
    public void deletePost(Long id) {
        findPostById(id);
        postMapper.deleteById(id);
    }

    private Post findPostById(Long id) {
        Post post = postMapper.findById(id);
        if (post == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return post;
    }

    private Post findPublishedPost(String slug) {
        Post post = postMapper.findBySlugAndStatus(slug, PostStatus.PUBLISHED);
        if (post == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return post;
    }

    private void ensureSlugIsAvailable(String slug, Long currentId) {
        Post existing = postMapper.findBySlug(slug);
        if (existing != null && (currentId == null || !currentId.equals(existing.getId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists");
        }
    }
}
