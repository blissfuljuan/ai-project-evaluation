package com.blissfuljuan.aiprojectevaluation.service.auth;

import com.blissfuljuan.aiprojectevaluation.dto.auth.AuthResponse;
import com.blissfuljuan.aiprojectevaluation.dto.auth.LoginRequest;
import com.blissfuljuan.aiprojectevaluation.dto.auth.RegisterRequest;
import com.blissfuljuan.aiprojectevaluation.dto.auth.UserProfileResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserProfileResponse getCurrentUser(Long currentUserId);
}
