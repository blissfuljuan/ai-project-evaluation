package com.blissfuljuan.aiprojectevaluation.controller;

import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassRequest;
import com.blissfuljuan.aiprojectevaluation.dto.courseclass.CourseClassResponse;
import com.blissfuljuan.aiprojectevaluation.security.service.CustomUserDetails;
import com.blissfuljuan.aiprojectevaluation.service.courseclass.CourseClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/teaching")
    public ResponseEntity<List<CourseClassResponse>> getTeachingClasses(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(courseClassService.getClassesByInstructor(currentUser.getUserId()));
    }

    @PostMapping
    public ResponseEntity<CourseClassResponse> createClass(
            @Valid @RequestBody CourseClassRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        CourseClassResponse response = courseClassService.createClass(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{classId}")
    public ResponseEntity<CourseClassResponse> updateClass(
            @PathVariable Long classId,
            @Valid @RequestBody CourseClassRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(courseClassService.updateClass(classId, request, currentUser.getUserId()));
    }

    @DeleteMapping("/{classId}")
    public ResponseEntity<Void> deleteClass(
            @PathVariable Long classId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        courseClassService.deleteClass(classId, currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }
}
