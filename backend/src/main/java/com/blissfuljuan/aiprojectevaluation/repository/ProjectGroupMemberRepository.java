package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.ProjectGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectGroupMemberRepository extends JpaRepository<ProjectGroupMember, Long> {
    boolean existsByCourseClassIdAndUserId(Long classId, Long userId);
    boolean existsByProjectGroupIdAndUserId(Long groupId, Long userId);
    Optional<ProjectGroupMember> findByCourseClassIdAndUserId(Long classId, Long userId);
    List<ProjectGroupMember> findByProjectGroupId(Long groupId);
    List<ProjectGroupMember> findByUserId(Long userId);
}
