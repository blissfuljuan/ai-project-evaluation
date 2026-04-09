package com.blissfuljuan.aiprojectevaluation.service.rubric;

import com.blissfuljuan.aiprojectevaluation.common.mapper.RubricMapper;
import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricCriterionRequest;
import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricRequest;
import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricResponse;
import com.blissfuljuan.aiprojectevaluation.exception.BadRequestException;
import com.blissfuljuan.aiprojectevaluation.exception.ForbiddenException;
import com.blissfuljuan.aiprojectevaluation.exception.ResourceNotFoundException;
import com.blissfuljuan.aiprojectevaluation.model.CourseClass;
import com.blissfuljuan.aiprojectevaluation.model.Rubric;
import com.blissfuljuan.aiprojectevaluation.model.RubricCriterion;
import com.blissfuljuan.aiprojectevaluation.model.User;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.Role;
import com.blissfuljuan.aiprojectevaluation.repository.CourseClassRepository;
import com.blissfuljuan.aiprojectevaluation.repository.RubricCriterionRepository;
import com.blissfuljuan.aiprojectevaluation.repository.RubricRepository;
import com.blissfuljuan.aiprojectevaluation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.IntStream;

@Service
@Transactional
public class RubricServiceImpl implements RubricService {

    private static final BigDecimal HUNDRED = new BigDecimal("100");

    private final RubricRepository rubricRepository;
    private final RubricCriterionRepository rubricCriterionRepository;
    private final CourseClassRepository courseClassRepository;
    private final UserRepository userRepository;
    private final RubricMapper rubricMapper;

    public RubricServiceImpl(
            RubricRepository rubricRepository,
            RubricCriterionRepository rubricCriterionRepository,
            CourseClassRepository courseClassRepository,
            UserRepository userRepository,
            RubricMapper rubricMapper
    ) {
        this.rubricRepository = rubricRepository;
        this.rubricCriterionRepository = rubricCriterionRepository;
        this.courseClassRepository = courseClassRepository;
        this.userRepository = userRepository;
        this.rubricMapper = rubricMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RubricResponse> getRubricsByInstructor(Long instructorId) {
        User currentUser = validateInstructorOrAdmin(instructorId);

        List<Rubric> rubrics = currentUser.getRole() == Role.ADMIN
                ? rubricRepository.findAllByOrderByUpdatedAtDesc()
                : rubricRepository.findByCourseClassInstructorIdOrderByUpdatedAtDesc(instructorId);

        return rubrics.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RubricResponse> getRubricsByClass(Long classId, Long userId) {
        User currentUser = validateInstructorOrAdmin(userId);
        CourseClass courseClass = findAccessibleClass(classId, currentUser);

        return rubricRepository.findByCourseClassIdOrderByUpdatedAtDesc(courseClass.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RubricResponse getRubricById(Long rubricId, Long userId) {
        User currentUser = validateInstructorOrAdmin(userId);
        Rubric rubric = findRubricById(rubricId);
        validateRubricAccess(rubric, currentUser);
        return toResponse(rubric);
    }

    @Override
    public RubricResponse createRubric(RubricRequest request, Long userId) {
        validateRequest(request);
        User currentUser = validateInstructorOrAdmin(userId);
        CourseClass courseClass = findAccessibleClass(request.getCourseClassId(), currentUser);

        if (rubricRepository.existsByCourseClassIdAndNameIgnoreCase(
                courseClass.getId(),
                request.getName().trim()
        )) {
            throw new BadRequestException("A rubric with the same name already exists in this class");
        }

        Rubric rubric = new Rubric();
        rubric.setName(request.getName());
        rubric.setDescription(request.getDescription());
        rubric.setCourseClass(courseClass);

        Rubric savedRubric = rubricRepository.save(rubric);
        saveCriteria(savedRubric, request.getCriteria());
        return toResponse(savedRubric);
    }

    @Override
    public RubricResponse updateRubric(Long rubricId, RubricRequest request, Long userId) {
        validateRequest(request);
        User currentUser = validateInstructorOrAdmin(userId);
        Rubric rubric = findRubricById(rubricId);
        validateRubricAccess(rubric, currentUser);

        CourseClass courseClass = findAccessibleClass(request.getCourseClassId(), currentUser);
        if (rubricRepository.existsByCourseClassIdAndNameIgnoreCaseAndIdNot(
                courseClass.getId(),
                request.getName().trim(),
                rubricId
        )) {
            throw new BadRequestException("A rubric with the same name already exists in this class");
        }

        rubric.setName(request.getName());
        rubric.setDescription(request.getDescription());
        rubric.setCourseClass(courseClass);
        Rubric savedRubric = rubricRepository.save(rubric);

        rubricCriterionRepository.deleteByRubricId(rubricId);
        saveCriteria(savedRubric, request.getCriteria());

        return toResponse(savedRubric);
    }

    @Override
    public void deleteRubric(Long rubricId, Long userId) {
        User currentUser = validateInstructorOrAdmin(userId);
        Rubric rubric = findRubricById(rubricId);
        validateRubricAccess(rubric, currentUser);
        rubricCriterionRepository.deleteByRubricId(rubricId);
        rubricRepository.delete(rubric);
    }

    private RubricResponse toResponse(Rubric rubric) {
        List<RubricCriterion> criteria =
                rubricCriterionRepository.findByRubricIdOrderByDisplayOrderAsc(rubric.getId());
        return rubricMapper.toResponse(rubric, criteria);
    }

    private void saveCriteria(Rubric rubric, List<RubricCriterionRequest> criteria) {
        List<RubricCriterion> entities = IntStream.range(0, criteria.size())
                .mapToObj(index -> toCriterionEntity(rubric, criteria.get(index), index + 1))
                .toList();

        rubricCriterionRepository.saveAll(entities);
    }

    private RubricCriterion toCriterionEntity(
            Rubric rubric,
            RubricCriterionRequest request,
            int displayOrder
    ) {
        RubricCriterion criterion = new RubricCriterion();
        criterion.setRubric(rubric);
        criterion.setCriterionName(request.getCriterionName());
        criterion.setDescription(request.getDescription());
        criterion.setWeight(request.getWeight());
        criterion.setMaxScore(request.getMaxScore());
        criterion.setDisplayOrder(displayOrder);
        return criterion;
    }

    private void validateRequest(RubricRequest request) {
        if (request == null) {
            throw new BadRequestException("Rubric request must not be null");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Rubric name is required");
        }

        if (request.getCourseClassId() == null) {
            throw new BadRequestException("Course class id is required");
        }

        if (request.getCriteria() == null || request.getCriteria().isEmpty()) {
            throw new BadRequestException("At least one rubric criterion is required");
        }

        BigDecimal totalWeight = request.getCriteria().stream()
                .map(RubricCriterionRequest::getWeight)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalWeight.compareTo(HUNDRED) != 0) {
            throw new BadRequestException("Rubric criteria weight must total exactly 100");
        }
    }

    private User validateInstructorOrAdmin(Long userId) {
        User user = findUserById(userId);
        if (user.getRole() != Role.INSTRUCTOR && user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only instructors and administrators can manage rubrics");
        }
        return user;
    }

    private CourseClass findAccessibleClass(Long classId, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return courseClassRepository.findById(classId)
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        }

        return courseClassRepository.findByIdAndInstructorId(classId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
    }

    private void validateRubricAccess(Rubric rubric, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        Long instructorId = rubric.getCourseClass().getInstructor() != null
                ? rubric.getCourseClass().getInstructor().getId()
                : null;

        if (instructorId == null || !instructorId.equals(currentUser.getId())) {
            throw new ForbiddenException("You are not allowed to manage this rubric");
        }
    }

    private Rubric findRubricById(Long rubricId) {
        return rubricRepository.findById(rubricId)
                .orElseThrow(() -> new ResourceNotFoundException("Rubric not found with id: " + rubricId));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
