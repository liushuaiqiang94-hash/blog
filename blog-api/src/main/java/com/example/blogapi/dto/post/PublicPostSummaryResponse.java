package com.example.blogapi.dto.post;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import java.time.LocalDateTime;

public record PublicPostSummaryResponse(
        Long id,
        String slug,
        String title,
        String summary,
        PostStatus status,
        LocalDateTime publishedAt) {

    public static PublicPostSummaryResponse from(Post post) {
        return new PublicPostSummaryResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getSummary(),
                post.getStatus(),
                post.getPublishedAt());
    }
}
