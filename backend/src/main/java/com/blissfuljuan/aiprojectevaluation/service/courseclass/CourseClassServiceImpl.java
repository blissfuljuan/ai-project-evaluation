package com.blissfuljuan.aiprojectevaluation.service.courseclass;

import com.blissfuljuan.aiprojectevaluation.dto.courseclass.ClassEnrollmentRequest;
import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassRequest;
import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassResponse;
import com.blissfuljuan.aiprojectevaluation.dto.user.UserSummaryResponse;
import com.blissfuljuan.aiprojectevaluation.exception.BadRequestException;
import com.blissfuljuan.aiprojectevaluation.exception.ForbiddenException;
import com.blissfuljuan.aiprojectevaluation.exception.ResourceNotFoundException;
import com.blissfuljuan.aiprojectevaluation.model.ClassMember;
import com.blissfuljuan.aiprojectevaluation.model.CourseClass;
import com.blissfuljuan.aiprojectevaluation.model.User;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.MembershipStatus;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.Role;
import com.blissfuljuan.aiprojectevaluation.repository.ClassMemberRepository;
import com.blissfuljuan.aiprojectevaluation.repository.CourseClassRepository;
import com.blissfuljuan.aiprojectevaluation.repository.ProjectGroupMemberRepository;
import com.blissfuljuan.aiprojectevaluation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CourseClassServiceImpl implements CourseClassService {

    private final ClassMemberRepository classMemberRepository;
    private final CourseClassRepository courseClassRepository;
    private final ProjectGroupMemberRepository projectGroupMemberRepository;
    private final UserRepository userRepository;

    public CourseClassServiceImpl(
            ClassMemberRepository classMemberRepository,
            CourseClassRepository courseClassRepository,
            ProjectGroupMemberRepository projectGroupMemberRepository,
            UserRepository userRepository
    ) {
        this.classMemberRepository = classMemberRepository;
        this.courseClassRepository = courseClassRepository;
        this.projectGroupMemberRepository = projectGroupMemberRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<CourseClassResponse> getClassesByUser(Long userId) {
        return classMemberRepository.findByUserIdAndStatus(userId, MembershipStatus.ACTIVE)
                .stream()
                .map(classMember -> toResponse(classMember.getCourseClass()))
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseClassResponse> getClassesByInstructor(Long instructorId) {
        validateTeacherRole(instructorId);
        return courseClassRepository.findByInstructorId(instructorId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseClassResponse createClass(CourseClassRequest request, Long instructorId) {
        validateRequest(request);
        User instructor = validateTeacherRole(instructorId);

        String normalizedClassCode = request.getClassCode().trim();
        if (courseClassRepository.existsByClassCodeIgnoreCase(normalizedClassCode)) {
            throw new BadRequestException("Class code is already in use");
        }

        CourseClass courseClass = new CourseClass();
        courseClass.setClassCode(normalizedClassCode);
        courseClass.setTitle(request.getTitle().trim());
        courseClass.setInstructor(instructor);

        return toResponse(courseClassRepository.save(courseClass));
    }

    @Override
    @Transactional
    public CourseClassResponse updateClass(Long classId, CourseClassRequest request, Long instructorId) {
        validateRequest(request);
        validateTeacherRole(instructorId);

        CourseClass courseClass = findOwnedClass(classId, instructorId);
        String normalizedClassCode = request.getClassCode().trim();

        if (courseClassRepository.existsByClassCodeIgnoreCaseAndIdNot(normalizedClassCode, classId)) {
            throw new BadRequestException("Class code is already in use");
        }

        courseClass.setClassCode(normalizedClassCode);
        courseClass.setTitle(request.getTitle().trim());

        return toResponse(courseClassRepository.save(courseClass));
    }

    @Override
    @Transactional
    public void deleteClass(Long classId, Long instructorId) {
        validateTeacherRole(instructorId);
        CourseClass courseClass = findOwnedClass(classId, instructorId);
        courseClassRepository.delete(courseClass);
    }

    @Override
    @Transactional
    public CourseClassResponse enrollInClass(ClassEnrollmentRequest request, Long userId) {
        if (request == null || request.getClassCode() == null || request.getClassCode().trim().isEmpty()) {
            throw new BadRequestException("Class code is required");
        }

        User user = findUserById(userId);
        if (user.getRole() != Role.STUDENT && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only students and administrators can enroll in a class");
        }

        CourseClass courseClass = courseClassRepository.findByClassCodeIgnoreCase(request.getClassCode().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found for code: " + request.getClassCode().trim()));

        ClassMember classMember = classMemberRepository.findByCourseClassIdAndUserId(courseClass.getId(), userId)
                .orElseGet(() -> new ClassMember(courseClass, user, MembershipStatus.ACTIVE));

        classMember.setCourseClass(courseClass);
        classMember.setUser(user);
        classMember.setStatus(MembershipStatus.ACTIVE);

        classMemberRepository.save(classMember);
        return toResponse(courseClass);
    }

    @Override
    public List<UserSummaryResponse> getEligibleGroupMembers(Long classId, Long userId) {
        validateActiveEnrollment(classId, userId);

        return classMemberRepository.findByCourseClassIdAndStatus(classId, MembershipStatus.ACTIVE)
                .stream()
                .map(ClassMember::getUser)
                .filter(user -> !user.getId().equals(userId))
                .filter(user -> !projectGroupMemberRepository.existsByCourseClassIdAndUserId(classId, user.getId()))
                .map(UserSummaryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private CourseClass findOwnedClass(Long classId, Long instructorId) {
        return courseClassRepository.findByIdAndInstructorId(classId, instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private User validateTeacherRole(Long userId) {
        User user = findUserById(userId);
        if (user.getRole() != Role.INSTRUCTOR && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only instructors and administrators can manage classes");
        }
        return user;
    }

    private void validateActiveEnrollment(Long classId, Long userId) {
        ClassMember classMember = classMemberRepository.findByCourseClassIdAndUserId(classId, userId)
                .orElseThrow(() -> new ForbiddenException("You must be enrolled in this class"));

        if (classMember.getStatus() != MembershipStatus.ACTIVE) {
            throw new ForbiddenException("You must be actively enrolled in this class");
        }
    }

    private void validateRequest(CourseClassRequest request) {
        if (request == null) {
            throw new BadRequestException("Class request must not be null");
        }

        if (request.getClassCode() == null || request.getClassCode().trim().isEmpty()) {
            throw new BadRequestException("Class code is required");
        }

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Title is required");
        }
    }

    private CourseClassResponse toResponse(CourseClass courseClass) {
        return new CourseClassResponse(
                courseClass.getId(),
                courseClass.getClassCode(),
                courseClass.getTitle()
        );
    }
}
