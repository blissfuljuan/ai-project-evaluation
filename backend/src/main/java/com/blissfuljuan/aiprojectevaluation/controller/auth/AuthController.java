package com.blissfuljuan.aiprojectevaluation.controller.auth;

import com.blissfuljuan.aiprojectevaluation.dto.auth.AuthResponse;
import com.blissfuljuan.aiprojectevaluation.dto.auth.LoginRequest;
import com.blissfuljuan.aiprojectevaluation.dto.auth.RegisterRequest;
import com.blissfuljuan.aiprojectevaluation.dto.auth.UserProfileResponse;
import com.blissfuljuan.aiprojectevaluation.security.service.CustomUserDetails;
import com.blissfuljuan.aiprojectevaluation.service.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails currentUser
            ) {
        UserProfileResponse response = authService.getCurrentUser(currentUser.getUserId());
        return ResponseEntity.ok(response);
    }
}
