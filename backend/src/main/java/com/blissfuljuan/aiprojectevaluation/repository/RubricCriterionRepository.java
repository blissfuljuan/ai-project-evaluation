package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.RubricCriterion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RubricCriterionRepository extends JpaRepository<RubricCriterion, Long> {
    List<RubricCriterion> findByRubricIdOrderByDisplayOrderAsc(Long rubricId);
}
