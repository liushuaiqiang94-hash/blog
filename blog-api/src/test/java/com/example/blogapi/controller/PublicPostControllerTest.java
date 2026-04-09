package com.example.blogapi.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.blogapi.support.MySqlContainerSupport;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
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

    @BeforeEach
    void cleanPosts() {
        jdbcTemplate.update("delete from post");
    }

    @Test
    void publicListReturnsOnlyPublishedPosts() throws Exception {
        insertPost("published-post", "Published post", "Published summary", "# Published", "PUBLISHED");
        insertPost("draft-post", "Draft post", "Draft summary", "# Draft", "DRAFT");

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].slug").value("published-post"))
                .andExpect(jsonPath("$[0].status").value("PUBLISHED"));
    }

    @Test
    void publicDetailReturnsPublishedPost() throws Exception {
        insertPost("published-post", "Published post", "Published summary", "# Published", "PUBLISHED");

        mockMvc.perform(get("/api/posts/published-post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("published-post"))
                .andExpect(jsonPath("$.contentMarkdown").value("# Published"));
    }

    private void insertPost(String slug, String title, String summary, String contentMarkdown, String status) {
        jdbcTemplate.update("""
                insert into post (slug, title, summary, content_markdown, status, published_at, created_at, updated_at)
                values (?, ?, ?, ?, ?, ?, current_timestamp(6), current_timestamp(6))
                """, slug, title, summary, contentMarkdown, status, "PUBLISHED".equals(status) ? LocalDateTime.now() : null);
    }
}
