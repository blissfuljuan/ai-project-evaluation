package com.blissfuljuan.aiprojectevaluation.dto.rubric;

import java.time.LocalDateTime;
import java.util.List;

public class RubricResponse {

    private Long id;
    private String name;
    private String description;
    private Long courseClassId;
    private String courseClassCode;
    private String courseClassTitle;
    private List<RubricCriterionResponse> criteria;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public List<RubricCriterionResponse> getCriteria() {
        return criteria;
    }

    public void setCriteria(List<RubricCriterionResponse> criteria) {
        this.criteria = criteria;
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
