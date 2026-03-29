package com.blissfuljuan.aiprojectevaluation.model;

import com.blissfuljuan.aiprojectevaluation.model.base.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "evaluation_scores",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"evaluation_id", "rubric_criterion_id"})
        }
)
public class EvaluationScore extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Evaluation evaluation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rubric_criterion_id", nullable = false)
    private RubricCriterion rubricCriterion;

    @Column(name = "raw_score", nullable = false, precision = 8, scale = 2)
    private BigDecimal rawScore;

    @Column(name = "weighted_score", nullable = false, precision = 8, scale = 2)
    private BigDecimal weightedScore;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    public EvaluationScore() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Evaluation getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Evaluation evaluation) {
        this.evaluation = evaluation;
    }

    public RubricCriterion getRubricCriterion() {
        return rubricCriterion;
    }

    public void setRubricCriterion(RubricCriterion rubricCriterion) {
        this.rubricCriterion = rubricCriterion;
    }

    public BigDecimal getRawScore() {
        return rawScore;
    }

    public void setRawScore(BigDecimal rawScore) {
        this.rawScore = rawScore;
    }

    public BigDecimal getWeightedScore() {
        return weightedScore;
    }

    public void setWeightedScore(BigDecimal weightedScore) {
        this.weightedScore = weightedScore;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
