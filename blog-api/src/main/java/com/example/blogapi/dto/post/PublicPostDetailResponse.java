package com.example.blogapi.dto.post;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import java.time.LocalDateTime;

public record PublicPostDetailResponse(
        Long id,
        String slug,
        String title,
        String summary,
        String contentMarkdown,
        PostStatus status,
        LocalDateTime publishedAt) {

    public static PublicPostDetailResponse from(Post post) {
        return new PublicPostDetailResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getSummary(),
                post.getContentMarkdown(),
                post.getStatus(),
                post.getPublishedAt());
    }
}
