package com.blissfuljuan.aiprojectevaluation.common.mapper;

import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricCriterionResponse;
import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricResponse;
import com.blissfuljuan.aiprojectevaluation.model.Rubric;
import com.blissfuljuan.aiprojectevaluation.model.RubricCriterion;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RubricMapper {

    public RubricResponse toResponse(Rubric rubric, List<RubricCriterion> criteria) {
        RubricResponse response = new RubricResponse();
        response.setId(rubric.getId());
        response.setName(rubric.getName());
        response.setDescription(rubric.getDescription());

        if (rubric.getCourseClass() != null) {
            response.setCourseClassId(rubric.getCourseClass().getId());
            response.setCourseClassCode(rubric.getCourseClass().getClassCode());
            response.setCourseClassTitle(rubric.getCourseClass().getTitle());
        }

        response.setCriteria(criteria.stream().map(this::toCriterionResponse).toList());
        response.setCreatedAt(rubric.getCreatedAt());
        response.setUpdatedAt(rubric.getUpdatedAt());

        return response;
    }

    private RubricCriterionResponse toCriterionResponse(RubricCriterion criterion) {
        RubricCriterionResponse response = new RubricCriterionResponse();
        response.setId(criterion.getId());
        response.setCriterionName(criterion.getCriterionName());
        response.setDescription(criterion.getDescription());
        response.setWeight(criterion.getWeight());
        response.setMaxScore(criterion.getMaxScore());
        response.setDisplayOrder(criterion.getDisplayOrder());
        return response;
    }
}
