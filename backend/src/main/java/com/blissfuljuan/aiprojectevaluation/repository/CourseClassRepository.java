package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseClassRepository extends JpaRepository<CourseClass, Long> {
    List<CourseClass> findByInstructorId(Long instructorId);
    Optional<CourseClass> findByIdAndInstructorId(Long id, Long instructorId);
    boolean existsByClassCodeIgnoreCase(String classCode);
    boolean existsByClassCodeIgnoreCaseAndIdNot(String classCode, Long id);
}
