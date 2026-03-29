package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.FeedbackReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackReportRepository extends JpaRepository<FeedbackReport, Long> {
    Optional<FeedbackReport> findByEvaluationId(Long evaluationId);
}
