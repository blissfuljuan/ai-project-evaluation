package com.blissfuljuan.aiprojectevaluation.model;

import com.blissfuljuan.aiprojectevaluation.model.base.BaseEntity;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.EvaluationStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.Fetch;
import org.springframework.util.function.SingletonSupplier;

import java.math.BigDecimal;

@Entity
@Table(
        name = "evaluations",
        indexes = {
                @Index(name = "idx_evaluations_submission", columnList = "submission_id"),
                @Index(name = "idx_evaluations_rubric", columnList = "rubric_id"),
                @Index(name = "idx_evaluations_evaluator", columnList = "evaluator_id")
        }
)
public class Evaluation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rubric_id", nullable = false)
    private Rubric rubric;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @Column(name = "total_score", precision = 8, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "instructor_comment", columnDefinition = "TEXT")
    private String instructorComment;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private EvaluationStatus status = EvaluationStatus.DRAFT;

    public Evaluation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public Rubric getRubric() {
        return rubric;
    }

    public void setRubric(Rubric rubric) {
        this.rubric = rubric;
    }

    public User getEvaluator() {
        return evaluator;
    }

    public void setEvaluator(User evaluator) {
        this.evaluator = evaluator;
    }

    public BigDecimal getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(BigDecimal totalScore) {
        this.totalScore = totalScore;
    }

    public String getInstructorComment() {
        return instructorComment;
    }

    public void setInstructorComment(String instructorComment) {
        this.instructorComment = instructorComment == null ? null : instructorComment.trim();
    }

    public EvaluationStatus getStatus() {
        return status;
    }

    public void setStatus(EvaluationStatus status) {
        this.status = status;
    }
}
