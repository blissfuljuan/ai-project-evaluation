package com.blissfuljuan.aiprojectevaluation.service.project;

import com.blissfuljuan.aiprojectevaluation.common.mapper.ProjectMapper;
import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectRequest;
import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectResponse;
import com.blissfuljuan.aiprojectevaluation.exception.BadRequestException;
import com.blissfuljuan.aiprojectevaluation.exception.ForbiddenException;
import com.blissfuljuan.aiprojectevaluation.exception.ResourceNotFoundException;
import com.blissfuljuan.aiprojectevaluation.model.CourseClass;
import com.blissfuljuan.aiprojectevaluation.model.Project;
import com.blissfuljuan.aiprojectevaluation.model.User;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.MembershipStatus;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.Role;
import com.blissfuljuan.aiprojectevaluation.repository.ClassMemberRepository;
import com.blissfuljuan.aiprojectevaluation.repository.CourseClassRepository;
import com.blissfuljuan.aiprojectevaluation.repository.ProjectRepository;
import com.blissfuljuan.aiprojectevaluation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ClassMemberRepository classMemberRepository;
    private final CourseClassRepository courseClassRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              ClassMemberRepository classMemberRepository,
                              CourseClassRepository courseClassRepository,
                              UserRepository userRepository,
                              ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.classMemberRepository = classMemberRepository;
        this.courseClassRepository = courseClassRepository;
        this.userRepository = userRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request, Long userId) {
        validateRequest(request);

        User user = findUserById(userId);
        CourseClass courseClass = findCourseClassById(request.getCourseClassId());
        validateEnrollment(courseClass.getId(), userId);
        boolean exists = projectRepository.existsByCourseClassIdAndTitleIgnoreCase(
                courseClass.getId(),
                request.getTitle().trim()
        );

        if(exists) {
            throw new BadRequestException("A project with the same title already exists in this class");
        }

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setCourseClass(courseClass);
        project.setCreatedBy(user);

        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByUser(Long userId) {
        return projectRepository.findByCreatedByIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponse> getProjectsByClass(Long classId) {
        return projectRepository.findByCourseClassIdOrderByCreatedAtDesc(classId)
                .stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        Project project = findProjectById(id);
        return projectMapper.toResponse(project);
    }

    @Override
    public ProjectResponse updateProjectById(Long id, ProjectRequest request, Long userId) {
        validateRequest(request);

        Project project = findProjectById(id);
        User currentUser = findUserById(userId);

        validateOwnership(project, currentUser);

        CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getCourseClassId()));
        validateEnrollment(courseClass.getId(), userId);

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setCourseClass(courseClass);

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toResponse(updatedProject);
    }

    @Override
    public void deleteProject(Long id, Long userId) {
        Project project = findProjectById(id);
        User currentUser = findUserById(userId);

        validateOwnership(project, currentUser);
        projectRepository.delete(project);
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private CourseClass findCourseClassById(Long id) {
        return courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
    }

    private void validateRequest(ProjectRequest request) {
        if(request == null) {
            throw new BadRequestException("Project request must not be null");
        }

        if( request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Project title is required");
        }

        if(request.getCourseClassId() == null) {
            throw new BadRequestException("Course class id is required");
        }
    }

    private void validateOwnership(Project project, User currentUser) {
        boolean isOwner = project.getCreatedBy() != null &&
                project.getCreatedBy().getId().equals(currentUser.getId());

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if(!isOwner && !isAdmin) {
            throw new ForbiddenException("You are not allowed to modify this project");
        }
    }

    private void validateEnrollment(Long classId, Long userId) {
        boolean enrolled = classMemberRepository.existsByCourseClassIdAndUserIdAndStatus(
                classId,
                userId,
                MembershipStatus.ACTIVE
        );

        if (!enrolled) {
            throw new ForbiddenException("You must be actively enrolled in this class to create or update a project");
        }
    }
}
