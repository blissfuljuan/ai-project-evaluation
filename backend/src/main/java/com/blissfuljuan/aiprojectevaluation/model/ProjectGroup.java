package com.blissfuljuan.aiprojectevaluation.model;

import com.blissfuljuan.aiprojectevaluation.model.base.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(
        name = "project_groups",
        indexes = {
                @Index(name = "idx_project_groups_class", columnList = "class_id")
        }
)
public class ProjectGroup extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_name", nullable = false, length = 100)
    private String groupName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private CourseClass courseClass;

    public ProjectGroup() {
    }

    public ProjectGroup(String groupName, CourseClass courseClass) {
        this.groupName = groupName;
        this.courseClass = courseClass;
    }

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
        this.groupName = groupName == null ? null : groupName.trim();
    }

    public CourseClass getCourseClass() {
        return courseClass;
    }

    public void setCourseClass(CourseClass courseClass) {
        this.courseClass = courseClass;
    }
}
