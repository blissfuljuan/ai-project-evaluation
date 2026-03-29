package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByProjectId(Long projectId);
    List<Submission> findByProjectGroupId(Long groupId);
    Optional<Submission> findTopByProjectIdAndProjectGroupIdOrderByVersionNumberDesc(Long projectId, Long groupId);
}
