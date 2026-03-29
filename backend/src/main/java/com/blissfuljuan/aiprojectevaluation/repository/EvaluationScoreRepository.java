package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.EvaluationScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationScoreRepository extends JpaRepository<EvaluationScore, Long> {
    List<EvaluationScore> findByEvaluationId(Long evaluationId);
}
