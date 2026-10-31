package com.autocarepro.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "registration_number", nullable = false, unique = true, length = 30)
    private String registrationNumber;

    @Column(nullable = false, length = 50)
    private String manufacturer;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(name = "manufacturing_year", nullable = false)
    private Integer manufacturingYear;

    @Column(name = "fuel_type", nullable = false, length = 20)
    private String fuelType;

    @Column(name = "current_mileage", nullable = false)
    private Integer currentMileage = 0;

    @Column(name = "vehicle_category", nullable = false, length = 30)
    private String vehicleCategory = "SEDAN";

    @Column(name = "last_service_date")
    private LocalDate lastServiceDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Vehicle() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getManufacturingYear() { return manufacturingYear; }
    public void setManufacturingYear(Integer manufacturingYear) { this.manufacturingYear = manufacturingYear; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public Integer getCurrentMileage() { return currentMileage; }
    public void setCurrentMileage(Integer currentMileage) { this.currentMileage = currentMileage; }

    public String getVehicleCategory() { return vehicleCategory; }
    public void setVehicleCategory(String vehicleCategory) { this.vehicleCategory = vehicleCategory; }

    public LocalDate getLastServiceDate() { return lastServiceDate; }
    public void setLastServiceDate(LocalDate lastServiceDate) { this.lastServiceDate = lastServiceDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
