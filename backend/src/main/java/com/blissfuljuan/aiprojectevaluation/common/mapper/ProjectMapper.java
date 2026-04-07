package com.blissfuljuan.aiprojectevaluation.common.mapper;

import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectResponse;
import com.blissfuljuan.aiprojectevaluation.model.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());

        if (project.getCourseClass() != null ){
            response.setCourseClassId(project.getCourseClass().getId());
            response.setCourseClassCode(project.getCourseClass().getClassCode());
            response.setCourseClassTitle(project.getCourseClass().getTitle());
        }

        if( project.getCreatedBy() != null) {
            response.setCreatedById(project.getCreatedBy().getId());
            response.setCreatedByEmail(project.getCreatedBy().getEmail());
        }

        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());

        return response;
    }
}
