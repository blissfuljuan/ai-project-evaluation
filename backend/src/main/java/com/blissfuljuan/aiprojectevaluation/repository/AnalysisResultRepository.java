package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    List<AnalysisResult> findBySubmissionId(Long submissionId);
}
