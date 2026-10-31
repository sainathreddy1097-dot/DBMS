package com.autocarepro.controller;

import com.autocarepro.entity.User;
import com.autocarepro.entity.Vehicle;
import com.autocarepro.security.CustomUserDetails;
import com.autocarepro.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getVehicles(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        if ("ROLE_ADMIN".equals(user.getRole().name())) {
            return ResponseEntity.ok(vehicleService.getAllVehicles());
        }
        return ResponseEntity.ok(vehicleService.getVehiclesByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @PostMapping
    public ResponseEntity<Vehicle> registerVehicle(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                   @RequestBody Vehicle vehicle) {
        Vehicle saved = vehicleService.registerVehicle(userDetails.getUser(), vehicle);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok().build();
    }
}
