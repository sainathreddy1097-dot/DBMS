package com.autocarepro.service;

import com.autocarepro.entity.User;
import com.autocarepro.entity.Vehicle;
import com.autocarepro.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByUserId(userId);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    @Transactional
    public Vehicle registerVehicle(User user, Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new IllegalArgumentException("Registration number already registered: " + vehicle.getRegistrationNumber());
        }
        vehicle.setUser(user);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle updated) {
        Vehicle existing = getVehicleById(id);
        existing.setManufacturer(updated.getManufacturer());
        existing.setModel(updated.getModel());
        existing.setManufacturingYear(updated.getManufacturingYear());
        existing.setFuelType(updated.getFuelType());
        existing.setCurrentMileage(updated.getCurrentMileage());
        existing.setVehicleCategory(updated.getVehicleCategory());
        if (updated.getLastServiceDate() != null) {
            existing.setLastServiceDate(updated.getLastServiceDate());
        }
        return vehicleRepository.save(existing);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
