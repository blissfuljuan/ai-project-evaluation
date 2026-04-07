package com.blissfuljuan.aiprojectevaluation.dto.auth;

import com.blissfuljuan.aiprojectevaluation.model.User;

public class UserProfileResponse {
    private Long id;
    private String firstname;
    private String middlename;
    private String lastname;
    private String email;
    private String role;

    public UserProfileResponse() {
    }

    public static UserProfileResponse fromEntity(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setFirstname(user.getFirstname());
        response.setMiddlename(user.getMiddlename());
        response.setLastname(user.getLastname());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        return response;
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

    public String getMiddlename() {
        return middlename;
    }

    public void setMiddlename(String middlename) {
        this.middlename = middlename;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
