package com.blissfuljuan.aiprojectevaluation.service.projectgroup;

import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRoleUpdateRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupResponse;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupUpdateRequest;

import java.util.List;

public interface ProjectGroupService {
    List<ProjectGroupResponse> getMyGroups(Long userId);
    ProjectGroupResponse createGroup(ProjectGroupRequest request, Long userId);
    ProjectGroupResponse updateGroup(Long groupId, ProjectGroupUpdateRequest request, Long userId);
    ProjectGroupResponse addMember(Long groupId, ProjectGroupMemberRequest request, Long userId);
    ProjectGroupResponse updateMemberRole(Long groupId, Long memberUserId, ProjectGroupMemberRoleUpdateRequest request, Long userId);
    ProjectGroupResponse removeMember(Long groupId, Long memberUserId, Long userId);
}
