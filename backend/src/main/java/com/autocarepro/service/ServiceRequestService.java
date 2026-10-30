package com.autocarepro.service;

import com.autocarepro.dto.AssignMechanicRequest;
import com.autocarepro.dto.ServiceBookingRequest;
import com.autocarepro.dto.StatusUpdateRequest;
import com.autocarepro.entity.*;
import com.autocarepro.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final VehicleRepository vehicleRepository;
    private final MechanicRepository mechanicRepository;
    private final MechanicAssignmentRepository assignmentRepository;
    private final ServiceUpdateRepository updateRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository,
                                 VehicleRepository vehicleRepository,
                                 MechanicRepository mechanicRepository,
                                 MechanicAssignmentRepository assignmentRepository,
                                 ServiceUpdateRepository updateRepository,
                                 MaintenanceRecordRepository maintenanceRecordRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.vehicleRepository = vehicleRepository;
        this.mechanicRepository = mechanicRepository;
        this.assignmentRepository = assignmentRepository;
        this.updateRepository = updateRepository;
        this.maintenanceRecordRepository = maintenanceRecordRepository;
    }

    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<ServiceRequest> getRequestsByUser(Long userId) {
        return serviceRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ServiceRequest> getRequestsByMechanic(Long mechanicId) {
        return serviceRequestRepository.findByMechanicIdOrderByCreatedAtDesc(mechanicId);
    }

    public ServiceRequest getRequestById(Long id) {
        return serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found with id: " + id));
    }

    public ServiceRequest getByBookingReference(String ref) {
        return serviceRequestRepository.findByBookingReference(ref)
                .orElseThrow(() -> new RuntimeException("Service request not found with reference: " + ref));
    }

    @Transactional
    public ServiceRequest bookVehicleService(User user, ServiceBookingRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + request.getVehicleId()));

        String reference = "AP-" + LocalDate.now().getYear() + "-" + (1000 + new Random().nextInt(9000));
        while (serviceRequestRepository.findByBookingReference(reference).isPresent()) {
            reference = "AP-" + LocalDate.now().getYear() + "-" + (1000 + new Random().nextInt(9000));
        }

        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setBookingReference(reference);
        serviceRequest.setUser(user);
        serviceRequest.setVehicle(vehicle);
        serviceRequest.setServiceCategory(request.getServiceCategory());
        serviceRequest.setProblemDescription(request.getProblemDescription());
        serviceRequest.setPreferredDate(request.getPreferredDate());
        serviceRequest.setStatus("BOOKED");
        serviceRequest.setEstimatedCost(getDefaultEstimate(request.getServiceCategory()));

        return serviceRequestRepository.save(serviceRequest);
    }

    @Transactional
    public ServiceRequest approveBooking(Long id, BigDecimal estimatedCost, String adminNotes) {
        ServiceRequest req = getRequestById(id);
        req.setStatus("APPROVED");
        if (estimatedCost != null && estimatedCost.compareTo(BigDecimal.ZERO) > 0) {
            req.setEstimatedCost(estimatedCost);
        }
        if (adminNotes != null) {
            req.setAdminNotes(adminNotes);
        }
        return serviceRequestRepository.save(req);
    }

    @Transactional
    public ServiceRequest rejectBooking(Long id, String adminNotes) {
        ServiceRequest req = getRequestById(id);
        req.setStatus("REJECTED");
        req.setAdminNotes(adminNotes);
        return serviceRequestRepository.save(req);
    }

    @Transactional
    public ServiceRequest assignMechanic(Long requestId, Long adminUserId, AssignMechanicRequest request) {
        ServiceRequest req = getRequestById(requestId);
        Mechanic mechanic = mechanicRepository.findById(request.getMechanicId())
                .orElseThrow(() -> new RuntimeException("Mechanic not found with id: " + request.getMechanicId()));

        req.setMechanic(mechanic);
        req.setStatus("ASSIGNED");
        if (request.getNotes() != null) {
            req.setAdminNotes(request.getNotes());
        }
        serviceRequestRepository.save(req);

        // Record Assignment
        MechanicAssignment assignment = new MechanicAssignment();
        assignment.setServiceRequest(req);
        assignment.setMechanic(mechanic);
        assignment.setAssignedByUserId(adminUserId);
        assignment.setStatus("ACTIVE");
        assignment.setNotes(request.getNotes());
        assignmentRepository.save(assignment);

        // Update mechanic active job counter
        mechanic.setActiveJobsCount(mechanic.getActiveJobsCount() + 1);
        mechanicRepository.save(mechanic);

        // Record Initial Service Update
        ServiceUpdate update = new ServiceUpdate();
        update.setServiceRequest(req);
        update.setMechanic(mechanic);
        update.setStatus("ASSIGNED");
        update.setNotes("Assigned to mechanic: " + mechanic.getUser().getFullName() + ". Work queue scheduled.");
        updateRepository.save(update);

        return req;
    }

    @Transactional
    public ServiceRequest updateServiceStatus(Long requestId, User actor, StatusUpdateRequest request) {
        ServiceRequest req = getRequestById(requestId);
        String previousStatus = req.getStatus();
        String newStatus = request.getStatus();

        req.setStatus(newStatus);
        serviceRequestRepository.save(req);

        Mechanic mechanic = req.getMechanic();
        if (mechanic == null && actor != null) {
            mechanic = mechanicRepository.findByUserId(actor.getId()).orElse(null);
        }

        // Add Service Update log
        ServiceUpdate update = new ServiceUpdate();
        update.setServiceRequest(req);
        update.setMechanic(mechanic);
        update.setStatus(newStatus);
        update.setNotes(request.getNotes() != null ? request.getNotes() : "Status updated to " + newStatus);
        update.setPartsReplaced(request.getPartsReplaced());
        updateRepository.save(update);

        // If completed or delivered, adjust mechanic counters and maintenance history
        if ("COMPLETED".equalsIgnoreCase(newStatus) && !"COMPLETED".equalsIgnoreCase(previousStatus)) {
            if (mechanic != null && mechanic.getActiveJobsCount() > 0) {
                mechanic.setActiveJobsCount(mechanic.getActiveJobsCount() - 1);
                mechanicRepository.save(mechanic);
            }

            // Create Maintenance Record for vehicle
            Vehicle v = req.getVehicle();
            v.setLastServiceDate(LocalDate.now());
            vehicleRepository.save(v);

            MaintenanceRecord record = new MaintenanceRecord();
            record.setVehicle(v);
            record.setServiceRequest(req);
            record.setServiceDate(LocalDate.now());
            record.setMileage(v.getCurrentMileage());
            record.setServiceType(req.getServiceCategory());
            record.setDetails("Service completed. " + (request.getNotes() != null ? request.getNotes() : ""));
            record.setNextServiceDueDate(LocalDate.now().plusMonths(6));
            record.setNextServiceDueMileage(v.getCurrentMileage() + 10000);
            maintenanceRecordRepository.save(record);
        }

        return req;
    }

    public List<ServiceUpdate> getUpdatesByRequestId(Long requestId) {
        return updateRepository.findByServiceRequestIdOrderByUpdatedAtDesc(requestId);
    }

    private BigDecimal getDefaultEstimate(String category) {
        if (category == null) return new BigDecimal("2500.00");
        return switch (category.toLowerCase()) {
            case "general servicing" -> new BigDecimal("5500.00");
            case "oil change" -> new BigDecimal("3200.00");
            case "engine repair" -> new BigDecimal("8500.00");
            case "brake inspection" -> new BigDecimal("3800.00");
            case "wheel alignment" -> new BigDecimal("1800.00");
            case "battery replacement" -> new BigDecimal("6000.00");
            case "ac service" -> new BigDecimal("3500.00");
            case "tyre replacement" -> new BigDecimal("9000.00");
            case "full vehicle inspection" -> new BigDecimal("2000.00");
            default -> new BigDecimal("3000.00");
        };
    }
}
