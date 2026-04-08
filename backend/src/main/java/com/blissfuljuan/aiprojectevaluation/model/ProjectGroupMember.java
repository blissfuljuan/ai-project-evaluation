package com.blissfuljuan.aiprojectevaluation.model;

import com.blissfuljuan.aiprojectevaluation.model.base.BaseEntity;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.ProjectGroupMemberRole;
import jakarta.persistence.*;

@Entity
@Table(
        name = "project_group_members",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"project_group_id", "user_id"}),
                @UniqueConstraint(columnNames = {"class_id", "user_id"})
        },
        indexes = {
                @Index(name = "idx_project_group_members_group", columnList = "project_group_id"),
                @Index(name = "idx_project_group_members_class", columnList = "class_id"),
                @Index(name = "idx_project_group_members_user", columnList = "user_id")
        }
)
public class ProjectGroupMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_group_id", nullable = false)
    private ProjectGroup projectGroup;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private CourseClass courseClass;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_role", nullable = false, length = 20)
    private ProjectGroupMemberRole role = ProjectGroupMemberRole.MEMBER;

    public ProjectGroupMember() {
    }

    public ProjectGroupMember(
            ProjectGroup projectGroup,
            CourseClass courseClass,
            User user,
            ProjectGroupMemberRole role
    ) {
        this.projectGroup = projectGroup;
        this.courseClass = courseClass;
        this.user = user;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProjectGroup getProjectGroup() {
        return projectGroup;
    }

    public void setProjectGroup(ProjectGroup projectGroup) {
        this.projectGroup = projectGroup;
    }

    public CourseClass getCourseClass() {
        return courseClass;
    }

    public void setCourseClass(CourseClass courseClass) {
        this.courseClass = courseClass;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProjectGroupMemberRole getRole() {
        return role;
    }

    public void setRole(ProjectGroupMemberRole role) {
        this.role = role;
    }
}
