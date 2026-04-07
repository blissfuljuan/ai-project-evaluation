package com.blissfuljuan.aiprojectevaluation.service.courseclass;

import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassRequest;
import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassResponse;

import java.util.List;

public interface CourseClassService {
    List<CourseClassResponse> getClassesByUser(Long userId);
    List<CourseClassResponse> getClassesByInstructor(Long instructorId);
    CourseClassResponse createClass(CourseClassRequest request, Long instructorId);
    CourseClassResponse updateClass(Long classId, CourseClassRequest request, Long instructorId);
    void deleteClass(Long classId, Long instructorId);
}
