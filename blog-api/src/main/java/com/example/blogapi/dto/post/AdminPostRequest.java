package com.example.blogapi.dto.post;

import com.example.blogapi.domain.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminPostRequest(
        @NotBlank String title,
        @NotBlank String slug,
        @NotBlank String summary,
        @NotBlank String contentMarkdown,
        @NotNull PostStatus status) {
}
