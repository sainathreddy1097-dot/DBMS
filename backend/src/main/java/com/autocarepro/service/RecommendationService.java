package com.autocarepro.service;

import com.autocarepro.dto.RecommendationDto;
import com.autocarepro.entity.MaintenanceRecord;
import com.autocarepro.entity.Vehicle;
import com.autocarepro.repository.MaintenanceRecordRepository;
import com.autocarepro.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    private final VehicleRepository vehicleRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;

    public RecommendationService(VehicleRepository vehicleRepository,
                                 MaintenanceRecordRepository maintenanceRecordRepository) {
        this.vehicleRepository = vehicleRepository;
        this.maintenanceRecordRepository = maintenanceRecordRepository;
    }

    public List<RecommendationDto> generateVehicleRecommendations(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

        List<MaintenanceRecord> records = maintenanceRecordRepository.findByVehicleIdOrderByServiceDateDesc(vehicleId);
        List<RecommendationDto> recommendations = new ArrayList<>();

        int currentMileage = vehicle.getCurrentMileage();
        int currentYear = LocalDate.now().getYear();
        int vehicleAgeYears = Math.max(1, currentYear - vehicle.getManufacturingYear());

        LocalDate lastService = vehicle.getLastServiceDate();
        if (lastService == null && !records.isEmpty()) {
            lastService = records.get(0).getServiceDate();
        }
        if (lastService == null) {
            lastService = LocalDate.now().minusMonths(7);
        }

        long monthsSinceLastService = ChronoUnit.MONTHS.between(lastService, LocalDate.now());
        long daysSinceLastService = ChronoUnit.DAYS.between(lastService, LocalDate.now());

        int lastServiceMileage = 0;
        if (!records.isEmpty()) {
            lastServiceMileage = records.get(0).getMileage();
        } else {
            lastServiceMileage = Math.max(0, currentMileage - 8500);
        }
        int kmDrivenSinceLastService = Math.max(0, currentMileage - lastServiceMileage);

        // Rule 1: Engine Oil Change
        if (kmDrivenSinceLastService >= 9000 || monthsSinceLastService >= 6) {
            String urgency = (kmDrivenSinceLastService >= 10000 || monthsSinceLastService >= 9) ? "HIGH" : "MEDIUM";
            recommendations.add(new RecommendationDto(
                    "Engine Oil & Filter Renewal Due",
                    urgency,
                    "Oil Change",
                    "Driven " + kmDrivenSinceLastService + " km and " + monthsSinceLastService + " months since last renewal. Synthetic oil viscosity breaks down past 10,000 km or 6 months.",
                    3200.00,
                    kmDrivenSinceLastService + " km interval threshold reached"
            ));
        }

        // Rule 2: General Servicing
        if (kmDrivenSinceLastService >= 10000 || monthsSinceLastService >= 10) {
            recommendations.add(new RecommendationDto(
                    "Annual Periodic Service Due",
                    "HIGH",
                    "General Servicing",
                    "Vehicle has elapsed " + monthsSinceLastService + " months without complete system diagnostics. Comprehensive fluids, suspension and ECU scanning advised.",
                    5500.00,
                    monthsSinceLastService + " months elapsed since comprehensive maintenance"
            ));
        }

        // Rule 3: Brake Inspection
        if (currentMileage >= 30000 && (currentMileage % 15000 <= 3000 || kmDrivenSinceLastService >= 12000)) {
            recommendations.add(new RecommendationDto(
                    "Front & Rear Brake Caliper/Disc Inspection",
                    "MEDIUM",
                    "Brake Inspection",
                    "Total mileage (" + currentMileage + " km) indicates brake friction material wear nearing 4mm threshold. Ultrasonic disc runout test suggested.",
                    2800.00,
                    "Total vehicle mileage: " + currentMileage + " km"
            ));
        }

        // Rule 4: Tyre Inspection / Replacement
        if (currentMileage >= 40000 && (currentMileage % 40000 <= 6000 || vehicleAgeYears >= 4)) {
            recommendations.add(new RecommendationDto(
                    "Tyre Tread Depth & Alignment Inspection",
                    "HIGH",
                    "Wheel Alignment",
                    "Vehicle age (" + vehicleAgeYears + " years) and mileage (" + currentMileage + " km) suggest rubber hardening and irregular camber wear patterns.",
                    1800.00,
                    "Age (" + vehicleAgeYears + " yrs) & total distance (" + currentMileage + " km)"
            ));
        }

        // Rule 5: AC Service & HEPA Filter Replacement
        if (monthsSinceLastService >= 8) {
            recommendations.add(new RecommendationDto(
                    "Cabin AC Filter & Evaporator Disinfection",
                    "LOW",
                    "AC Service",
                    "Evaporator bacterial accumulation and cabin dust filter saturation typical after 8+ months of climate control operation.",
                    2200.00,
                    "Seasonal duration (" + monthsSinceLastService + " months)"
            ));
        }

        // Rule 6: Battery Health
        if (vehicleAgeYears >= 3) {
            recommendations.add(new RecommendationDto(
                    "12V Starter Battery Cold Cranking Diagnostic",
                    "MEDIUM",
                    "Battery Replacement",
                    "Lead-acid starter batteries experience 25% capacity degradation after 3 years in Indian climate conditions.",
                    500.00,
                    "Vehicle operational age: " + vehicleAgeYears + " years"
            ));
        }

        return recommendations;
    }
}
