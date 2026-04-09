package com.blissfuljuan.aiprojectevaluation.controller;

import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricRequest;
import com.blissfuljuan.aiprojectevaluation.dto.rubric.RubricResponse;
import com.blissfuljuan.aiprojectevaluation.security.service.CustomUserDetails;
import com.blissfuljuan.aiprojectevaluation.service.rubric.RubricService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rubrics")
public class RubricController {

    private final RubricService rubricService;

    public RubricController(RubricService rubricService) {
        this.rubricService = rubricService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<RubricResponse>> getMyRubrics(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(rubricService.getRubricsByInstructor(currentUser.getUserId()));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<RubricResponse>> getRubricsByClass(
            @PathVariable Long classId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(rubricService.getRubricsByClass(classId, currentUser.getUserId()));
    }

    @GetMapping("/{rubricId}")
    public ResponseEntity<RubricResponse> getRubricById(
            @PathVariable Long rubricId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(rubricService.getRubricById(rubricId, currentUser.getUserId()));
    }

    @PostMapping
    public ResponseEntity<RubricResponse> createRubric(
            @Valid @RequestBody RubricRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        RubricResponse response = rubricService.createRubric(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{rubricId}")
    public ResponseEntity<RubricResponse> updateRubric(
            @PathVariable Long rubricId,
            @Valid @RequestBody RubricRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(rubricService.updateRubric(rubricId, request, currentUser.getUserId()));
    }

    @DeleteMapping("/{rubricId}")
    public ResponseEntity<Void> deleteRubric(
            @PathVariable Long rubricId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        rubricService.deleteRubric(rubricId, currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }
}
