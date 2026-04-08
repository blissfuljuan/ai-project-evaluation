package com.blissfuljuan.aiprojectevaluation.dto.projectgroup;

import com.blissfuljuan.aiprojectevaluation.model.ProjectGroupMember;
import com.blissfuljuan.aiprojectevaluation.model.User;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.ProjectGroupMemberRole;

public class ProjectGroupMemberResponse {

    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private ProjectGroupMemberRole role;

    public ProjectGroupMemberResponse() {
    }

    public ProjectGroupMemberResponse(
            Long id,
            String firstname,
            String lastname,
            String email,
            ProjectGroupMemberRole role
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.role = role;
    }

    public static ProjectGroupMemberResponse fromEntity(ProjectGroupMember projectGroupMember) {
        User user = projectGroupMember.getUser();
        return new ProjectGroupMemberResponse(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                projectGroupMember.getRole()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ProjectGroupMemberRole getRole() {
        return role;
    }

    public void setRole(ProjectGroupMemberRole role) {
        this.role = role;
    }
}
