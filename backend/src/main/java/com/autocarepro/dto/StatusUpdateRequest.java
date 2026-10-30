package com.autocarepro.dto;

import jakarta.validation.constraints.NotBlank;

public class StatusUpdateRequest {
    @NotBlank
    private String status;

    private String notes;
    private String partsReplaced;

    public StatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPartsReplaced() { return partsReplaced; }
    public void setPartsReplaced(String partsReplaced) { this.partsReplaced = partsReplaced; }
}
