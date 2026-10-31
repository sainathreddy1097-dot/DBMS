package com.autocarepro.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "part_id", nullable = false)
    private SparePart sparePart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    @Column(name = "transaction_type", nullable = false, length = 10)
    private String transactionType; // IN or OUT

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    private String notes;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate = LocalDateTime.now();

    public InventoryTransaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SparePart getSparePart() { return sparePart; }
    public void setSparePart(SparePart sparePart) { this.sparePart = sparePart; }

    public ServiceRequest getServiceRequest() { return serviceRequest; }
    public void setServiceRequest(ServiceRequest serviceRequest) { this.serviceRequest = serviceRequest; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}
