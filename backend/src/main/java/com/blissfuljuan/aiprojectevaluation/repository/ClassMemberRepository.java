package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.ClassMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassMemberRepository extends JpaRepository<ClassMember, Long> {
    boolean existsByCourseClassIdAndUserId(Long classId, Long userId);
    Optional<ClassMember> findByCourseClassIdAndUserId(Long classId, Long userId);
    List<ClassMember> findByCourseClassId(Long classId);
}
