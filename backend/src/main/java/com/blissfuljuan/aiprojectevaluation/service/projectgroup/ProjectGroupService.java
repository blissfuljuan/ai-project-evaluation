package com.blissfuljuan.aiprojectevaluation.service.projectgroup;

import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupMemberRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupRequest;
import com.blissfuljuan.aiprojectevaluation.dto.projectgroup.ProjectGroupResponse;

import java.util.List;

public interface ProjectGroupService {
    List<ProjectGroupResponse> getMyGroups(Long userId);
    ProjectGroupResponse createGroup(ProjectGroupRequest request, Long userId);
    ProjectGroupResponse addMember(Long groupId, ProjectGroupMemberRequest request, Long userId);
}
