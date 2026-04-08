package com.blissfuljuan.aiprojectevaluation.dto.projectgroup;

import jakarta.validation.constraints.NotNull;

public class ProjectGroupMemberRequest {

    @NotNull(message = "User id is required")
    private Long userId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
