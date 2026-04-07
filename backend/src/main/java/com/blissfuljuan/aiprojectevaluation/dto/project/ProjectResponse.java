package com.blissfuljuan.aiprojectevaluation.dto.project;

import java.time.LocalDateTime;

public class ProjectResponse {

    private Long id;
    private String title;
    private String description;

    private Long courseClassId;
    private String courseClassCode;
    private String courseClassTitle;

    private Long createdById;
    private String createdByEmail;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCourseClassId() {
        return courseClassId;
    }

    public void setCourseClassId(Long courseClassId) {
        this.courseClassId = courseClassId;
    }

    public String getCourseClassCode() {
        return courseClassCode;
    }

    public void setCourseClassCode(String courseClassCode) {
        this.courseClassCode = courseClassCode;
    }

    public String getCourseClassTitle() {
        return courseClassTitle;
    }

    public void setCourseClassTitle(String courseClassTitle) {
        this.courseClassTitle = courseClassTitle;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
