package com.autocarepro.dto;

public class RecommendationDto {
    private String title;
    private String urgency; // HIGH, MEDIUM, LOW
    private String category;
    private String explanation;
    private Double estimatedCost;
    private String triggerFactor;

    public RecommendationDto() {}

    public RecommendationDto(String title, String urgency, String category, String explanation, Double estimatedCost, String triggerFactor) {
        this.title = title;
        this.urgency = urgency;
        this.category = category;
        this.explanation = explanation;
        this.estimatedCost = estimatedCost;
        this.triggerFactor = triggerFactor;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public String getTriggerFactor() { return triggerFactor; }
    public void setTriggerFactor(String triggerFactor) { this.triggerFactor = triggerFactor; }
}
