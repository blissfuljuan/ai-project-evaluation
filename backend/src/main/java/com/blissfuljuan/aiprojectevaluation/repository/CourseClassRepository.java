package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseClassRepository extends JpaRepository<CourseClass, Long> {
    List<CourseClass> findByInstructorId(Long instructorId);
}
