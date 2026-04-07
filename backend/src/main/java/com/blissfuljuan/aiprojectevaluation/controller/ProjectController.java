package com.blissfuljuan.aiprojectevaluation.controller;

import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectRequest;
import com.blissfuljuan.aiprojectevaluation.dto.project.ProjectResponse;
import com.blissfuljuan.aiprojectevaluation.security.service.CustomUserDetails;
import com.blissfuljuan.aiprojectevaluation.service.project.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
            ) {
        ProjectResponse response = projectService.createProject(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(projectService.getProjectsByUser(currentUser.getUserId()));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(projectService.getProjectsByClass(classId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }
}
