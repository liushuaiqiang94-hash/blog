package com.example.blogapi.service;

import com.example.blogapi.domain.AdminUser;
import com.example.blogapi.mapper.AdminUserMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdminUserMapper adminUserMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AdminUserMapper adminUserMapper, PasswordEncoder passwordEncoder) {
        this.adminUserMapper = adminUserMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminUser authenticate(String username, String password) {
        AdminUser adminUser = adminUserMapper.findByUsername(username);
        if (adminUser == null || !passwordEncoder.matches(password, adminUser.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        return adminUser;
    }
}
