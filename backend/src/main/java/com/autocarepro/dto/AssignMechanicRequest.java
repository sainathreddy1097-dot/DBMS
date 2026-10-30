package com.autocarepro.dto;

import jakarta.validation.constraints.NotNull;

public class AssignMechanicRequest {
    @NotNull
    private Long mechanicId;

    private String notes;

    public AssignMechanicRequest() {}

    public Long getMechanicId() { return mechanicId; }
    public void setMechanicId(Long mechanicId) { this.mechanicId = mechanicId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
