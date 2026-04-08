package com.blissfuljuan.aiprojectevaluation.service.projectgroup;

import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupResponse;
import com.blissfuljuan.aiprojectevaluation.dto.user.UserSummaryResponse;
import com.blissfuljuan.aiprojectevaluation.exception.BadRequestException;
import com.blissfuljuan.aiprojectevaluation.exception.ForbiddenException;
import com.blissfuljuan.aiprojectevaluation.exception.ResourceNotFoundException;
import com.blissfuljuan.aiprojectevaluation.model.ClassMember;
import com.blissfuljuan.aiprojectevaluation.model.CourseClass;
import com.blissfuljuan.aiprojectevaluation.model.ProjectGroup;
import com.blissfuljuan.aiprojectevaluation.model.ProjectGroupMember;
import com.blissfuljuan.aiprojectevaluation.model.User;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.MembershipStatus;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.Role;
import com.blissfuljuan.aiprojectevaluation.repository.ClassMemberRepository;
import com.blissfuljuan.aiprojectevaluation.repository.CourseClassRepository;
import com.blissfuljuan.aiprojectevaluation.repository.ProjectGroupMemberRepository;
import com.blissfuljuan.aiprojectevaluation.repository.ProjectGroupRepository;
import com.blissfuljuan.aiprojectevaluation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectGroupServiceImpl implements ProjectGroupService {

    private final ProjectGroupRepository projectGroupRepository;
    private final ProjectGroupMemberRepository projectGroupMemberRepository;
    private final CourseClassRepository courseClassRepository;
    private final ClassMemberRepository classMemberRepository;
    private final UserRepository userRepository;

    public ProjectGroupServiceImpl(
            ProjectGroupRepository projectGroupRepository,
            ProjectGroupMemberRepository projectGroupMemberRepository,
            CourseClassRepository courseClassRepository,
            ClassMemberRepository classMemberRepository,
            UserRepository userRepository
    ) {
        this.projectGroupRepository = projectGroupRepository;
        this.projectGroupMemberRepository = projectGroupMemberRepository;
        this.courseClassRepository = courseClassRepository;
        this.classMemberRepository = classMemberRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectGroupResponse> getMyGroups(Long userId) {
        return projectGroupMemberRepository.findByUserId(userId)
                .stream()
                .map(ProjectGroupMember::getProjectGroup)
                .distinct()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectGroupResponse createGroup(ProjectGroupRequest request, Long userId) {
        validateStudentRole(userId);
        validateRequest(request);

        CourseClass courseClass = findCourseClassById(request.getCourseClassId());
        validateActiveEnrollment(courseClass.getId(), userId);

        if (projectGroupMemberRepository.existsByCourseClassIdAndUserId(courseClass.getId(), userId)) {
            throw new BadRequestException("You are already assigned to a group in this class");
        }

        if (projectGroupRepository.existsByCourseClassIdAndGroupNameIgnoreCase(courseClass.getId(), request.getGroupName().trim())) {
            throw new BadRequestException("A group with the same name already exists in this class");
        }

        ProjectGroup projectGroup = new ProjectGroup();
        projectGroup.setGroupName(request.getGroupName().trim());
        projectGroup.setCourseClass(courseClass);
        ProjectGroup savedGroup = projectGroupRepository.save(projectGroup);

        Set<Long> memberIds = new LinkedHashSet<>();
        memberIds.add(userId);
        if (request.getMemberUserIds() != null) {
          memberIds.addAll(request.getMemberUserIds());
        }

        for (Long memberId : memberIds) {
            addMemberInternal(savedGroup, memberId);
        }

        return toResponse(savedGroup);
    }

    @Override
    public ProjectGroupResponse addMember(Long groupId, ProjectGroupMemberRequest request, Long userId) {
        validateStudentRole(userId);
        if (request == null || request.getUserId() == null) {
            throw new BadRequestException("User id is required");
        }

        ProjectGroup projectGroup = findGroupById(groupId);
        if (!projectGroupMemberRepository.existsByProjectGroupIdAndUserId(groupId, userId)) {
            throw new ForbiddenException("You must be a member of this group to add another member");
        }

        addMemberInternal(projectGroup, request.getUserId());
        return toResponse(projectGroup);
    }

    private void addMemberInternal(ProjectGroup projectGroup, Long memberUserId) {
        Long classId = projectGroup.getCourseClass().getId();
        validateActiveEnrollment(classId, memberUserId);

        if (projectGroupMemberRepository.existsByProjectGroupIdAndUserId(projectGroup.getId(), memberUserId)) {
            throw new BadRequestException("User is already a member of this group");
        }

        if (projectGroupMemberRepository.existsByCourseClassIdAndUserId(classId, memberUserId)) {
            throw new BadRequestException("User is already assigned to another group in this class");
        }

        User member = findUserById(memberUserId);
        ProjectGroupMember projectGroupMember =
                new ProjectGroupMember(projectGroup, projectGroup.getCourseClass(), member);
        projectGroupMemberRepository.save(projectGroupMember);
    }

    private void validateRequest(ProjectGroupRequest request) {
        if (request == null) {
            throw new BadRequestException("Group request must not be null");
        }

        if (request.getGroupName() == null || request.getGroupName().trim().isEmpty()) {
            throw new BadRequestException("Group name is required");
        }

        if (request.getCourseClassId() == null) {
            throw new BadRequestException("Course class id is required");
        }
    }

    private void validateStudentRole(Long userId) {
        User user = findUserById(userId);
        if (user.getRole() != Role.STUDENT && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only students and administrators can manage student groups");
        }
    }

    private void validateActiveEnrollment(Long classId, Long userId) {
        ClassMember classMember = classMemberRepository.findByCourseClassIdAndUserId(classId, userId)
                .orElseThrow(() -> new ForbiddenException("User must be enrolled in this class"));

        if (classMember.getStatus() != MembershipStatus.ACTIVE) {
            throw new ForbiddenException("User must be actively enrolled in this class");
        }
    }

    private CourseClass findCourseClassById(Long classId) {
        return courseClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
    }

    private ProjectGroup findGroupById(Long groupId) {
        return projectGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private ProjectGroupResponse toResponse(ProjectGroup projectGroup) {
        ProjectGroupResponse response = new ProjectGroupResponse();
        response.setId(projectGroup.getId());
        response.setGroupName(projectGroup.getGroupName());
        response.setCourseClassId(projectGroup.getCourseClass().getId());
        response.setCourseClassCode(projectGroup.getCourseClass().getClassCode());
        response.setCourseClassTitle(projectGroup.getCourseClass().getTitle());
        response.setMembers(
                projectGroupMemberRepository.findByProjectGroupId(projectGroup.getId())
                        .stream()
                        .map(ProjectGroupMember::getUser)
                        .map(UserSummaryResponse::fromEntity)
                        .collect(Collectors.toList())
        );
        return response;
    }
}
