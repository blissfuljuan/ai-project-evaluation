package com.blissfuljuan.aiprojectevaluation.dto.projectgroup;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class ProjectGroupRequest {

    @NotBlank(message = "Group name is required")
    @Size(max = 100, message = "Group name must not exceed 100 characters")
    private String groupName;

    @NotNull(message = "Course class id is required")
    private Long courseClassId;

    private List<Long> memberUserIds;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Long getCourseClassId() {
        return courseClassId;
    }

    public void setCourseClassId(Long courseClassId) {
        this.courseClassId = courseClassId;
    }

    public List<Long> getMemberUserIds() {
        return memberUserIds;
    }

    public void setMemberUserIds(List<Long> memberUserIds) {
        this.memberUserIds = memberUserIds;
    }
}
