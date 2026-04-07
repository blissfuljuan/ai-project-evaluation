package com.blissfuljuan.aiprojectevaluation.service.project;

import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectRequest;
import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectResponse;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(ProjectRequest request, Long userId);
    List<ProjectResponse> getAllProjects();
    List<ProjectResponse> getProjectsByUser(Long userId);
    List<ProjectResponse> getProjectsByClass(Long classId);
    ProjectResponse getProjectById(Long id);
    ProjectResponse updateProjectById(Long id, ProjectRequest request, Long userId);
    void deleteProject(Long id, Long userId);
}
