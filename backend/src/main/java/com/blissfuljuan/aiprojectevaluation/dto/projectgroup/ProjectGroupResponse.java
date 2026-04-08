package com.blissfuljuan.aiprojectevaluation.dto.projectgroup;

import com.blissfuljuan.aiprojectevaluation.dto.user.UserSummaryResponse;

import java.util.List;

public class ProjectGroupResponse {

    private Long id;
    private String groupName;
    private Long courseClassId;
    private String courseClassCode;
    private String courseClassTitle;
    private UserSummaryResponse groupLeader;
    private List<ProjectGroupMemberResponse> members;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getCourseClassCode() {
        return courseClassCode;
    }

    public void setCourseClassCode(String courseClassCode) {
        this.courseClassCode = courseClassCode;
    }

    public String getCourseClassTitle() {
        return courseClassTitle;
    }

    public void setCourseClassTitle(String courseClassTitle) {
        this.courseClassTitle = courseClassTitle;
    }

    public UserSummaryResponse getGroupLeader() {
        return groupLeader;
    }

    public void setGroupLeader(UserSummaryResponse groupLeader) {
        this.groupLeader = groupLeader;
    }

    public List<ProjectGroupMemberResponse> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectGroupMemberResponse> members) {
        this.members = members;
    }
}
