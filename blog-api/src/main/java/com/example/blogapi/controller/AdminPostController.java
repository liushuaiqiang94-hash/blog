package com.example.blogapi.controller;

import com.example.blogapi.dto.post.AdminPostRequest;
import com.example.blogapi.dto.post.AdminPostResponse;
import com.example.blogapi.service.PostService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
        return postService.listAdminPosts();
    }

    @GetMapping("/{id}")
    public AdminPostResponse detail(@PathVariable Long id) {
        return postService.getAdminPost(id);
    }

    @PostMapping
    public ResponseEntity<AdminPostResponse> create(@Valid @RequestBody AdminPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(request));
    }

    @PutMapping("/{id}")
    public AdminPostResponse update(@PathVariable Long id, @Valid @RequestBody AdminPostRequest request) {
        return postService.updatePost(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
