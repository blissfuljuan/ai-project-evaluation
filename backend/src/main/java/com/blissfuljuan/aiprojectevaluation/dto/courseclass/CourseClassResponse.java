package com.blissfuljuan.aiprojectevaluation.dto.courseclass;

public class CourseClassResponse {

    private Long id;
    private String classCode;
    private String title;

    public CourseClassResponse() {
    }

    public CourseClassResponse(Long id, String classCode, String title) {
        this.id = id;
        this.classCode = classCode;
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
