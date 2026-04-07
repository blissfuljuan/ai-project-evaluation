package com.blissfuljuan.aiprojectevaluation.dto.courseclass;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ClassEnrollmentRequest {

    @NotBlank(message = "Class code is required")
    @Size(max = 50, message = "Class code must not exceed 50 characters")
    private String classCode;

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }
}
