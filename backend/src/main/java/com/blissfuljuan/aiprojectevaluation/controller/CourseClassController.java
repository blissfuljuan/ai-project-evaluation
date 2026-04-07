package com.blissfuljuan.aiprojectevaluation.controller;

import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassResponse;
import com.blissfuljuan.aiprojectevaluation.security.service.CustomUserDetails;
import com.blissfuljuan.aiprojectevaluation.service.courseclass.CourseClassService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class CourseClassController {

    private final CourseClassService courseClassService;

    public CourseClassController(CourseClassService courseClassService) {
        this.courseClassService = courseClassService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<CourseClassResponse>> getMyClasses(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(courseClassService.getClassesByUser(currentUser.getUserId()));
    }
}
