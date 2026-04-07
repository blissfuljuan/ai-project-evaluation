package com.blissfuljuan.aiprojectevaluation.service.courseclass;

import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassResponse;

import java.util.List;

public interface CourseClassService {
    List<CourseClassResponse> getClassesByUser(Long userId);
}
