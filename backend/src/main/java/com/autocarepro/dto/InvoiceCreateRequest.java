package com.autocarepro.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class InvoiceCreateRequest {
    @NotNull
    private Long serviceRequestId;

    @NotNull
    private BigDecimal labourCharges;

    @NotNull
    private BigDecimal sparePartsCharges;

    private BigDecimal gstRate = new BigDecimal("18.00");

    private List<InvoiceItemDto> items;

    public static class InvoiceItemDto {
        private String itemType;
        private String description;
        private Integer quantity;
        private BigDecimal unitPrice;

        public String getItemType() { return itemType; }
        public void setItemType(String itemType) { this.itemType = itemType; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }

    public InvoiceCreateRequest() {}

    public Long getServiceRequestId() { return serviceRequestId; }
    public void setServiceRequestId(Long serviceRequestId) { this.serviceRequestId = serviceRequestId; }

    public BigDecimal getLabourCharges() { return labourCharges; }
    public void setLabourCharges(BigDecimal labourCharges) { this.labourCharges = labourCharges; }

    public BigDecimal getSparePartsCharges() { return sparePartsCharges; }
    public void setSparePartsCharges(BigDecimal sparePartsCharges) { this.sparePartsCharges = sparePartsCharges; }

    public BigDecimal getGstRate() { return gstRate; }
    public void setGstRate(BigDecimal gstRate) { this.gstRate = gstRate; }

    public List<InvoiceItemDto> getItems() { return items; }
    public void setItems(List<InvoiceItemDto> items) { this.items = items; }
}
