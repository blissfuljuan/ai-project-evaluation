package com.blissfuljuan.aiprojectevaluation.service.projectgroup;

import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberResponse;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRoleUpdateRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupResponse;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupUpdateRequest;
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
import com.blissfuljuan.aiprojectevaluation.model.enumtype.ProjectGroupMemberRole;
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
    @Transactional(readOnly = true)
    public List<ProjectGroupResponse> getGroupsByInstructor(Long instructorId) {
        validateTeacherRole(instructorId);

        return projectGroupRepository.findByCourseClassInstructorIdOrderByCourseClassTitleAscGroupNameAsc(instructorId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectGroupResponse createGroup(ProjectGroupRequest request, Long userId) {
        validateStudentRole(userId);
        validateRequest(request);

        CourseClass courseClass = findCourseClassById(request.getCourseClassId());
        validateActiveEnrollment(courseClass.getId(), userId);
        validateUserHasNoGroupInClass(courseClass.getId(), userId);
        validateUniqueGroupName(courseClass.getId(), request.getGroupName().trim(), null);

        ProjectGroup projectGroup = new ProjectGroup();
        projectGroup.setGroupName(request.getGroupName().trim());
        projectGroup.setCourseClass(courseClass);
        ProjectGroup savedGroup = projectGroupRepository.save(projectGroup);

        Set<Long> memberIds = buildMemberIds(userId, request.getMemberUserIds());
        boolean leaderAssigned = false;
        for (Long memberId : memberIds) {
            addMemberInternal(
                    savedGroup,
                    memberId,
                    leaderAssigned ? ProjectGroupMemberRole.MEMBER : ProjectGroupMemberRole.LEADER
            );
            leaderAssigned = true;
        }

        return toResponse(savedGroup);
    }

    @Override
    public ProjectGroupResponse updateGroup(Long groupId, ProjectGroupUpdateRequest request, Long userId) {
        validateStudentRole(userId);
        String normalizedGroupName = normalizeGroupName(request);

        ProjectGroup projectGroup = findGroupById(groupId);
        validateLeader(groupId, userId);
        validateUniqueGroupName(
                projectGroup.getCourseClass().getId(),
                normalizedGroupName,
                projectGroup
        );

        projectGroup.setGroupName(normalizedGroupName);
        return toResponse(projectGroupRepository.save(projectGroup));
    }

    @Override
    public ProjectGroupResponse addMember(Long groupId, ProjectGroupMemberRequest request, Long userId) {
        validateStudentRole(userId);
        if (request == null || request.getUserId() == null) {
            throw new BadRequestException("User id is required");
        }

        ProjectGroup projectGroup = findGroupById(groupId);
        validateLeader(groupId, userId);

        addMemberInternal(projectGroup, request.getUserId(), ProjectGroupMemberRole.MEMBER);
        return toResponse(projectGroup);
    }

    @Override
    public ProjectGroupResponse updateMemberRole(
            Long groupId,
            Long memberUserId,
            ProjectGroupMemberRoleUpdateRequest request,
            Long userId
    ) {
        validateStudentRole(userId);
        if (request == null || request.getRole() == null) {
            throw new BadRequestException("Member role is required");
        }

        ProjectGroup projectGroup = findGroupById(groupId);
        validateLeader(groupId, userId);

        ProjectGroupMember targetMember = findGroupMember(groupId, memberUserId);
        ProjectGroupMember currentLeader = findLeaderMember(groupId);
        ProjectGroupMemberRole targetRole = request.getRole();

        if (targetMember.getRole() == targetRole) {
            return toResponse(projectGroup);
        }

        if (targetRole == ProjectGroupMemberRole.LEADER) {
            currentLeader.setRole(ProjectGroupMemberRole.MEMBER);
            targetMember.setRole(ProjectGroupMemberRole.LEADER);
            projectGroupMemberRepository.save(currentLeader);
            projectGroupMemberRepository.save(targetMember);
            return toResponse(projectGroup);
        }

        if (targetMember.getRole() == ProjectGroupMemberRole.LEADER) {
            throw new BadRequestException("Assign another leader before changing the current leader's role");
        }

        targetMember.setRole(ProjectGroupMemberRole.MEMBER);
        projectGroupMemberRepository.save(targetMember);
        return toResponse(projectGroup);
    }

    @Override
    public ProjectGroupResponse removeMember(Long groupId, Long memberUserId, Long userId) {
        validateStudentRole(userId);
        ProjectGroup projectGroup = findGroupById(groupId);
        validateLeader(groupId, userId);

        ProjectGroupMember targetMember = findGroupMember(groupId, memberUserId);
        if (targetMember.getRole() == ProjectGroupMemberRole.LEADER) {
            throw new BadRequestException("The current leader cannot be removed");
        }

        projectGroupMemberRepository.delete(targetMember);
        return toResponse(projectGroup);
    }

    private void addMemberInternal(
            ProjectGroup projectGroup,
            Long memberUserId,
            ProjectGroupMemberRole memberRole
    ) {
        Long classId = projectGroup.getCourseClass().getId();
        validateActiveEnrollment(classId, memberUserId);

        if (projectGroupMemberRepository.existsByProjectGroupIdAndUserId(projectGroup.getId(), memberUserId)) {
            throw new BadRequestException("User is already a member of this group");
        }

        validateUserHasNoGroupInClass(classId, memberUserId);

        User member = findUserById(memberUserId);
        ProjectGroupMember projectGroupMember =
                new ProjectGroupMember(projectGroup, projectGroup.getCourseClass(), member, memberRole);
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

    private void validateTeacherRole(Long userId) {
        User user = findUserById(userId);
        if (user.getRole() != Role.INSTRUCTOR && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only instructors and administrators can view class groups");
        }
    }

    private Set<Long> buildMemberIds(Long leaderUserId, List<Long> memberUserIds) {
        Set<Long> memberIds = new LinkedHashSet<>();
        memberIds.add(leaderUserId);

        if (memberUserIds != null) {
            memberIds.addAll(memberUserIds);
        }

        return memberIds;
    }

    private String normalizeGroupName(ProjectGroupUpdateRequest request) {
        if (request == null || request.getGroupName() == null || request.getGroupName().trim().isEmpty()) {
            throw new BadRequestException("Group name is required");
        }

        return request.getGroupName().trim();
    }

    private void validateUniqueGroupName(Long classId, String groupName, ProjectGroup currentGroup) {
        if (!projectGroupRepository.existsByCourseClassIdAndGroupNameIgnoreCase(classId, groupName)) {
            return;
        }

        if (currentGroup != null && currentGroup.getGroupName().equalsIgnoreCase(groupName)) {
            return;
        }

        throw new BadRequestException("A group with the same name already exists in this class");
    }

    private void validateUserHasNoGroupInClass(Long classId, Long userId) {
        if (projectGroupMemberRepository.existsByCourseClassIdAndUserId(classId, userId)) {
            throw new BadRequestException("User is already assigned to a group in this class");
        }
    }

    private void validateLeader(Long groupId, Long userId) {
        ProjectGroupMember projectGroupMember = findGroupMember(groupId, userId);

        if (projectGroupMember.getRole() != ProjectGroupMemberRole.LEADER) {
            throw new ForbiddenException("Only the group leader can perform this action");
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

    private ProjectGroupMember findGroupMember(Long groupId, Long userId) {
        return projectGroupMemberRepository.findByProjectGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Group member not found"));
    }

    private ProjectGroupMember findLeaderMember(Long groupId) {
        return projectGroupMemberRepository.findFirstByProjectGroupIdAndRole(groupId, ProjectGroupMemberRole.LEADER)
                .orElseThrow(() -> new ResourceNotFoundException("Group leader not found"));
    }

    private ProjectGroupResponse toResponse(ProjectGroup projectGroup) {
        ProjectGroupResponse response = new ProjectGroupResponse();
        response.setId(projectGroup.getId());
        response.setGroupName(projectGroup.getGroupName());
        response.setCourseClassId(projectGroup.getCourseClass().getId());
        response.setCourseClassCode(projectGroup.getCourseClass().getClassCode());
        response.setCourseClassTitle(projectGroup.getCourseClass().getTitle());
        response.setGroupLeader(findGroupLeader(projectGroup.getId()));
        response.setMembers(findGroupMembers(projectGroup.getId()));
        return response;
    }

    private UserSummaryResponse findGroupLeader(Long groupId) {
        return projectGroupMemberRepository.findFirstByProjectGroupIdAndRole(groupId, ProjectGroupMemberRole.LEADER)
                .map(ProjectGroupMember::getUser)
                .map(UserSummaryResponse::fromEntity)
                .orElse(null);
    }

    private List<ProjectGroupMemberResponse> findGroupMembers(Long groupId) {
        return projectGroupMemberRepository.findByProjectGroupId(groupId)
                .stream()
                .map(ProjectGroupMemberResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
