package com.autocarepro.controller;

import com.autocarepro.entity.Mechanic;
import com.autocarepro.security.CustomUserDetails;
import com.autocarepro.service.MechanicService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mechanics")
public class MechanicController {

    private final MechanicService mechanicService;

    public MechanicController(MechanicService mechanicService) {
        this.mechanicService = mechanicService;
    }

    @GetMapping
    public ResponseEntity<List<Mechanic>> getAllMechanics() {
        return ResponseEntity.ok(mechanicService.getAllMechanics());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Mechanic>> getAvailableMechanics() {
        return ResponseEntity.ok(mechanicService.getAvailableMechanics());
    }

    @GetMapping("/me")
    public ResponseEntity<Mechanic> getMyProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(mechanicService.getMechanicByUserId(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mechanic> getMechanicById(@PathVariable Long id) {
        return ResponseEntity.ok(mechanicService.getMechanicById(id));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Mechanic> updateAvailability(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "AVAILABLE");
        return ResponseEntity.ok(mechanicService.updateAvailability(id, status));
    }
}
