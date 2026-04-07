package com.blissfuljuan.aiprojectevaluation.service.service;

import com.blissfuljuan.aiprojectevaluation.common.mapper.ProjectMapper;
import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectRequest;
import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectResponse;
import com.blissfuljuan.aiprojectevaluation.repository.CourseClassRepository;
import com.blissfuljuan.aiprojectevaluation.repository.ProjectRepository;
import com.blissfuljuan.aiprojectevaluation.repository.UserRepository;

import java.util.List;

public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;
    private final CourseClassRepository courseClassRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              CourseClassRepository courseClassRepository,
                              UserRepository userRepository,
                              ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.courseClassRepository = courseClassRepository;
        this.userRepository = userRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request, Long userId) {
        return null;
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        return List.of();
    }

    @Override
    public List<ProjectResponse> getProjectsByUser(Long userId) {
        return List.of();
    }

    @Override
    public List<ProjectResponse> getProjectsByClass(Long classId) {
        return List.of();
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        return null;
    }

    @Override
    public ProjectResponse updateProjectById(Long id, ProjectRequest request, Long userId) {
        return null;
    }

    @Override
    public void deleteProject(Long id, Long userId) {

    }
}
