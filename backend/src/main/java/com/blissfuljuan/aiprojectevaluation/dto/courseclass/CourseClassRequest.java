package com.blissfuljuan.aiprojectevaluation.dto.courseclass;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CourseClassRequest {

    @NotBlank(message = "Class code is required")
    @Size(max = 50, message = "Class code must not exceed 50 characters")
    private String classCode;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
