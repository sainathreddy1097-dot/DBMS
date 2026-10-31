package com.autocarepro.controller;

import com.autocarepro.dto.AssignMechanicRequest;
import com.autocarepro.dto.ServiceBookingRequest;
import com.autocarepro.dto.StatusUpdateRequest;
import com.autocarepro.entity.Role;
import com.autocarepro.entity.ServiceRequest;
import com.autocarepro.entity.ServiceUpdate;
import com.autocarepro.entity.User;
import com.autocarepro.security.CustomUserDetails;
import com.autocarepro.service.MechanicService;
import com.autocarepro.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;
    private final MechanicService mechanicService;

    public ServiceRequestController(ServiceRequestService serviceRequestService, MechanicService mechanicService) {
        this.serviceRequestService = serviceRequestService;
        this.mechanicService = mechanicService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequest>> getServiceRequests(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        if (user.getRole() == Role.ROLE_ADMIN) {
            return ResponseEntity.ok(serviceRequestService.getAllRequests());
        } else if (user.getRole() == Role.ROLE_MECHANIC) {
            return ResponseEntity.ok(mechanicService.getAssignedJobsForUser(user.getId()));
        } else {
            return ResponseEntity.ok(serviceRequestService.getRequestsByUser(user.getId()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getRequestById(id));
    }

    @GetMapping("/{id}/updates")
    public ResponseEntity<List<ServiceUpdate>> getUpdates(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getUpdatesByRequestId(id));
    }

    @PostMapping
    public ResponseEntity<ServiceRequest> bookVehicleService(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                             @Valid @RequestBody ServiceBookingRequest request) {
        ServiceRequest saved = serviceRequestService.bookVehicleService(userDetails.getUser(), request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ServiceRequest> approveBooking(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> payload) {
        BigDecimal estimate = null;
        String notes = null;
        if (payload != null) {
            if (payload.containsKey("estimatedCost")) {
                estimate = new BigDecimal(payload.get("estimatedCost").toString());
            }
            if (payload.containsKey("adminNotes")) {
                notes = (String) payload.get("adminNotes");
            }
        }
        return ResponseEntity.ok(serviceRequestService.approveBooking(id, estimate, notes));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ServiceRequest> rejectBooking(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> payload) {
        String notes = payload != null && payload.containsKey("adminNotes") ? (String) payload.get("adminNotes") : "Declined by workshop manager.";
        return ResponseEntity.ok(serviceRequestService.rejectBooking(id, notes));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<ServiceRequest> assignMechanic(@PathVariable Long id,
                                                         @AuthenticationPrincipal CustomUserDetails userDetails,
                                                         @Valid @RequestBody AssignMechanicRequest request) {
        return ResponseEntity.ok(serviceRequestService.assignMechanic(id, userDetails.getId(), request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceRequest> updateStatus(@PathVariable Long id,
                                                       @AuthenticationPrincipal CustomUserDetails userDetails,
                                                       @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(serviceRequestService.updateServiceStatus(id, userDetails.getUser(), request));
    }
}
