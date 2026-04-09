package com.blissfuljuan.aiprojectevaluation.dto.rubric;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class RubricCriterionRequest {

    @NotBlank(message = "Criterion name is required")
    @Size(max = 150, message = "Criterion name must not exceed 150 characters")
    private String criterionName;

    @Size(max = 5000, message = "Criterion description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Criterion weight is required")
    @DecimalMin(value = "0.01", message = "Criterion weight must be greater than zero")
    private BigDecimal weight;

    @NotNull(message = "Criterion max score is required")
    @DecimalMin(value = "0.01", message = "Criterion max score must be greater than zero")
    private BigDecimal maxScore;

    public String getCriterionName() {
        return criterionName;
    }

    public void setCriterionName(String criterionName) {
        this.criterionName = criterionName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public BigDecimal getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(BigDecimal maxScore) {
        this.maxScore = maxScore;
    }
}
