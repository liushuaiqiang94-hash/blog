package com.example.blogapi.service;

import com.example.blogapi.domain.AdminUser;
import com.example.blogapi.mapper.AdminUserMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.stereotype.Service;

@Service
public class AdminBootstrapService {

    private final AdminUserMapper adminUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminBootstrapService(
            AdminUserMapper adminUserMapper,
            PasswordEncoder passwordEncoder,
            @Value("${blog.bootstrap.admin.username:admin}") String username,
            @Value("${blog.bootstrap.admin.password:change-me-now}") String password) {
        this.adminUserMapper = adminUserMapper;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapDefaultAdmin() {
        if (adminUserMapper.existsByUsername(username)) {
            return;
        }
        adminUserMapper.insert(new AdminUser(username, passwordEncoder.encode(password)));
    }
}
