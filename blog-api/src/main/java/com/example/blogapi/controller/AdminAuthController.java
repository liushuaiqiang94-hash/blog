package com.example.blogapi.controller;

import com.example.blogapi.domain.AdminUser;
import com.example.blogapi.dto.auth.LoginRequest;
import com.example.blogapi.dto.auth.LoginResponse;
import com.example.blogapi.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AuthService authService;

    public AdminAuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpServletRequest) {
        AdminUser adminUser = authService.authenticate(request.username(), request.password());
        HttpSession session = httpServletRequest.getSession(true);
        session.setAttribute("ADMIN_USER_ID", adminUser.getId());
        session.setAttribute("ADMIN_USERNAME", adminUser.getUsername());
        return ResponseEntity.ok(new LoginResponse(adminUser.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpServletRequest) {
        HttpSession session = httpServletRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentials(BadCredentialsException ignored) {
        return ResponseEntity.status(401).build();
    }
}
