package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCourseClassId(Long classId);
    List<Project> findByCourseClassIdOrderByCreatedAtDesc(Long classId);
    List<Project> findByCreatedByIdOrderByCreatedAtDesc(Long userId);
    boolean existsByCourseClassIdAndTitleIgnoreCase(Long classId, String title);
}
