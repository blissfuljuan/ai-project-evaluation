package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.ProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, Long> {
    List<ProjectGroup> findByCourseClassId(Long classId);
    List<ProjectGroup> findByCourseClassInstructorIdOrderByCourseClassTitleAscGroupNameAsc(Long instructorId);
    boolean existsByCourseClassIdAndGroupNameIgnoreCase(Long classId, String groupName);
}
