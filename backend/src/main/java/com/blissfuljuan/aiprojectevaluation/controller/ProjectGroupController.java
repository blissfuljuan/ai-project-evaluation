package com.blissfuljuan.aiprojectevaluation.controller;

import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRoleUpdateRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupResponse;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupUpdateRequest;
import com.blissfuljuan.aiprojectevaluation.security.service.CustomUserDetails;
import com.blissfuljuan.aiprojectevaluation.service.projectgroup.ProjectGroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class ProjectGroupController {

    private final ProjectGroupService projectGroupService;

    public ProjectGroupController(ProjectGroupService projectGroupService) {
        this.projectGroupService = projectGroupService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProjectGroupResponse>> getMyGroups(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(projectGroupService.getMyGroups(currentUser.getUserId()));
    }

    @GetMapping("/teaching")
    public ResponseEntity<List<ProjectGroupResponse>> getTeachingGroups(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(projectGroupService.getGroupsByInstructor(currentUser.getUserId()));
    }

    @PostMapping
    public ResponseEntity<ProjectGroupResponse> createGroup(
            @Valid @RequestBody ProjectGroupRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        ProjectGroupResponse response = projectGroupService.createGroup(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<ProjectGroupResponse> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody ProjectGroupUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(projectGroupService.updateGroup(groupId, request, currentUser.getUserId()));
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<ProjectGroupResponse> addMember(
            @PathVariable Long groupId,
            @Valid @RequestBody ProjectGroupMemberRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(projectGroupService.addMember(groupId, request, currentUser.getUserId()));
    }

    @PutMapping("/{groupId}/members/{memberUserId}/role")
    public ResponseEntity<ProjectGroupResponse> updateMemberRole(
            @PathVariable Long groupId,
            @PathVariable Long memberUserId,
            @Valid @RequestBody ProjectGroupMemberRoleUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(
                projectGroupService.updateMemberRole(groupId, memberUserId, request, currentUser.getUserId())
        );
    }

    @DeleteMapping("/{groupId}/members/{memberUserId}")
    public ResponseEntity<ProjectGroupResponse> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long memberUserId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(projectGroupService.removeMember(groupId, memberUserId, currentUser.getUserId()));
    }
}
