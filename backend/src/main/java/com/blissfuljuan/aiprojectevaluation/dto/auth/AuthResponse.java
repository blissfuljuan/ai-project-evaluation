package com.blissfuljuan.aiprojectevaluation.dto.auth;

public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private UserProfileResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String tokenType, UserProfileResponse user) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UserProfileResponse getUser() {
        return user;
    }

    public void setUser(UserProfileResponse user) {
        this.user = user;
    }
}
