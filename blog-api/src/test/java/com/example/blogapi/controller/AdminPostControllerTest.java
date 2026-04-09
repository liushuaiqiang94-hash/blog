package com.example.blogapi.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.blogapi.support.MySqlContainerSupport;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
@AutoConfigureMockMvc
class AdminPostControllerTest extends MySqlContainerSupport {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void cleanPosts() {
        jdbcTemplate.update("delete from post");
    }

    @Test
    void adminPostsRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/posts"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedAdminCanCreateDraftPost() throws Exception {
        MockHttpSession session = loginAsAdmin();

        mockMvc.perform(post("/api/admin/posts")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "First draft",
                                  "slug": "first-draft",
                                  "summary": "Draft summary",
                                  "contentMarkdown": "# Draft",
                                  "status": "DRAFT"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("first-draft"))
                .andExpect(jsonPath("$.status").value("DRAFT"));
    }

    @Test
    void authenticatedAdminCannotCreateDuplicateSlug() throws Exception {
        MockHttpSession session = loginAsAdmin();
        insertDraftPost("first-draft");

        mockMvc.perform(post("/api/admin/posts")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Second draft",
                                  "slug": "first-draft",
                                  "summary": "Duplicate summary",
                                  "contentMarkdown": "# Duplicate",
                                  "status": "DRAFT"
                                }
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void authenticatedAdminRejectsBlankTitle() throws Exception {
        MockHttpSession session = loginAsAdmin();

        mockMvc.perform(post("/api/admin/posts")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "",
                                  "slug": "blank-title",
                                  "summary": "Summary",
                                  "contentMarkdown": "# Draft",
                                  "status": "DRAFT"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    private MockHttpSession loginAsAdmin() throws Exception {
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(post("/api/admin/auth/login")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"admin","password":"change-me-now"}
                                """))
                .andExpect(status().isOk());

        assertThat(session.getAttribute("ADMIN_USER_ID")).isNotNull();
        return session;
    }

    private void createPostThroughApi(MockHttpSession session, String slug) throws Exception {
        mockMvc.perform(post("/api/admin/posts")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "First draft",
                                  "slug": "%s",
                                  "summary": "Draft summary",
                                  "contentMarkdown": "# Draft",
                                  "status": "DRAFT"
                                }
                                """.formatted(slug)))
                .andExpect(status().isCreated());
    }

    private void insertDraftPost(String slug) {
        jdbcTemplate.update("""
                insert into post (slug, title, summary, content_markdown, status, published_at, created_at, updated_at)
                values (?, ?, ?, ?, ?, ?, current_timestamp(6), current_timestamp(6))
                """, slug, "First draft", "Draft summary", "# Draft", "DRAFT", null);
    }
}
