package com.blissfuljuan.aiprojectevaluation.dto.rubric;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class RubricRequest {

    @NotBlank(message = "Rubric name is required")
    @Size(max = 150, message = "Rubric name must not exceed 150 characters")
    private String name;

    @Size(max = 5000, message = "Rubric description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Course class id is required")
    private Long courseClassId;

    @Valid
    @NotEmpty(message = "At least one criterion is required")
    private List<RubricCriterionRequest> criteria;

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

    public List<RubricCriterionRequest> getCriteria() {
        return criteria;
    }

    public void setCriteria(List<RubricCriterionRequest> criteria) {
        this.criteria = criteria;
    }
}
