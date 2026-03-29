package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.ProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, Long> {
    List<ProjectGroup> findByCourseClassId(Long classId);
}
