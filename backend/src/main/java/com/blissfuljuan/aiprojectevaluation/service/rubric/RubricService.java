package com.blissfuljuan.aiprojectevaluation.service.rubric;

import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricRequest;
import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricResponse;

import java.util.List;

public interface RubricService {

    List<RubricResponse> getRubricsByInstructor(Long instructorId);
    List<RubricResponse> getRubricsByClass(Long classId, Long userId);
    RubricResponse getRubricById(Long rubricId, Long userId);
    RubricResponse createRubric(RubricRequest request, Long userId);
    RubricResponse updateRubric(Long rubricId, RubricRequest request, Long userId);
    void deleteRubric(Long rubricId, Long userId);
}
