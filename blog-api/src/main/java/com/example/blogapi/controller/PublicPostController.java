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
        return postService.listPublicPosts();
    }

    @GetMapping("/{slug}")
    public PublicPostDetailResponse detail(@PathVariable String slug) {
        return postService.getPublicPost(slug);
    }
}
