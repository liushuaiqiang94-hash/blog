package com.example.blogapi.dto.post;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import java.time.LocalDateTime;

public record AdminPostResponse(
        Long id,
        String slug,
        String title,
        String summary,
        String contentMarkdown,
        PostStatus status,
        LocalDateTime publishedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static AdminPostResponse from(Post post) {
        return new AdminPostResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getSummary(),
                post.getContentMarkdown(),
                post.getStatus(),
                post.getPublishedAt(),
                post.getCreatedAt(),
                post.getUpdatedAt());
    }
}
