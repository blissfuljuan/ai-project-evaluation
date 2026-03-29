package com.blissfuljuan.aiprojectevaluation.model;

import com.blissfuljuan.aiprojectevaluation.model.base.BaseEntity;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.MembershipStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "class_members",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_class_member", columnNames = {"class_id", "user_id"})
        },
        indexes = {
                @Index(name = "idx_class_members_class", columnList = "class_id"),
                @Index(name = "idx_class_members_user", columnList = "user_id")
        }
)
public class ClassMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private CourseClass courseClass;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private MembershipStatus status = MembershipStatus.ACTIVE;

    public ClassMember() {
    }

    public ClassMember(CourseClass courseClass, User user, MembershipStatus status) {
        this.courseClass = courseClass;
        this.user = user;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public MembershipStatus getStatus() {
        return status;
    }

    public void setStatus(MembershipStatus status) {
        this.status = status;
    }
}