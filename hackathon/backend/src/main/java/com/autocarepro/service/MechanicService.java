package com.autocarepro.service;

import com.autocarepro.entity.Mechanic;
import com.autocarepro.entity.ServiceRequest;
import com.autocarepro.repository.MechanicRepository;
import com.autocarepro.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MechanicService {

    private final MechanicRepository mechanicRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    public MechanicService(MechanicRepository mechanicRepository, ServiceRequestRepository serviceRequestRepository) {
        this.mechanicRepository = mechanicRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public List<Mechanic> getAllMechanics() {
        return mechanicRepository.findAll();
    }

    public List<Mechanic> getAvailableMechanics() {
        return mechanicRepository.findByAvailabilityStatus("AVAILABLE");
    }

    public Mechanic getMechanicById(Long id) {
        return mechanicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mechanic not found with id: " + id));
    }

    public Mechanic getMechanicByUserId(Long userId) {
        return mechanicRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found for user id: " + userId));
    }

    public Mechanic updateAvailability(Long id, String status) {
        Mechanic mechanic = getMechanicById(id);
        mechanic.setAvailabilityStatus(status);
        return mechanicRepository.save(mechanic);
    }

    public List<ServiceRequest> getAssignedJobsForUser(Long userId) {
        Mechanic mechanic = getMechanicByUserId(userId);
        return serviceRequestRepository.findByMechanicIdOrderByCreatedAtDesc(mechanic.getId());
    }
}
