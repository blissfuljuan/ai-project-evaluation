package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.SubmissionFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionFileRepository extends JpaRepository<SubmissionFile, Long> {
    List<SubmissionFile> findBySubmissionId(Long submissionId);
}
