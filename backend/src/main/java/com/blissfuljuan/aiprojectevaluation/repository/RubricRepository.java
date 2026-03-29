package com.blissfuljuan.aiprojectevaluation.repository;

import com.blissfuljuan.aiprojectevaluation.model.Rubric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RubricRepository extends JpaRepository<Rubric, Long> {
    List<Rubric> findByCourseClassId(Long classId);
}
