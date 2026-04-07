package com.blissfuljuan.aiprojectevaluation.service.courseclass;

import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassResponse;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.MembershipStatus;
import com.blissfuljuan.aiprojectevaluation.repository.ClassMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CourseClassServiceImpl implements CourseClassService {

    private final ClassMemberRepository classMemberRepository;

    public CourseClassServiceImpl(ClassMemberRepository classMemberRepository) {
        this.classMemberRepository = classMemberRepository;
    }

    @Override
    public List<CourseClassResponse> getClassesByUser(Long userId) {
        return classMemberRepository.findByUserIdAndStatus(userId, MembershipStatus.ACTIVE)
                .stream()
                .map(classMember -> new CourseClassResponse(
                        classMember.getCourseClass().getId(),
                        classMember.getCourseClass().getClassCode(),
                        classMember.getCourseClass().getTitle()
                ))
                .collect(Collectors.toList());
    }
}
