package com.blissfuljuan.aiprojectevaluation.model;

import com.blissfuljuan.aiprojectevaluation.model.base.BaseEntity;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.AnalysisType;
import jakarta.persistence.*;

@Entity
@Table(
        name = "analysis_results",
        indexes = {
                @Index(name = "idx_analysis_results_submission", columnList = "submission_id")
        }
)
public class AnalysisResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @Enumerated(EnumType.STRING)
    @Column(name = "analysis_type", nullable = false, length = 50)
    private AnalysisType analysisType;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    public AnalysisResult() {
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

    public AnalysisType getAnalysisType() {
        return analysisType;
    }

    public void setAnalysisType(AnalysisType analysisType) {
        this.analysisType = analysisType;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary == null ? null : summary.trim();
    }

    public String getDetailsJson() {
        return detailsJson;
    }

    public void setDetailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
    }
}
