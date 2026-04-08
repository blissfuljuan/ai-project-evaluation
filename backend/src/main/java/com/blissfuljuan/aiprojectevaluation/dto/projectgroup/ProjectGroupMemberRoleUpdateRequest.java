package com.blissfuljuan.aiprojectevaluation.dto.projectgroup;

import com.blissfuljuan.aiprojectevaluation.model.enumtype.ProjectGroupMemberRole;
import jakarta.validation.constraints.NotNull;

public class ProjectGroupMemberRoleUpdateRequest {

    @NotNull(message = "Member role is required")
    private ProjectGroupMemberRole role;

    public ProjectGroupMemberRole getRole() {
        return role;
    }

    public void setRole(ProjectGroupMemberRole role) {
        this.role = role;
    }
}
