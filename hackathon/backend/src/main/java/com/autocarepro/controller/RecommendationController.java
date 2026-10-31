package com.autocarepro.controller;

import com.autocarepro.dto.RecommendationDto;
import com.autocarepro.entity.Vehicle;
import com.autocarepro.security.CustomUserDetails;
import com.autocarepro.service.RecommendationService;
import com.autocarepro.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final VehicleService vehicleService;

    public RecommendationController(RecommendationService recommendationService, VehicleService vehicleService) {
        this.recommendationService = recommendationService;
        this.vehicleService = vehicleService;
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<RecommendationDto>> getVehicleRecommendations(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(recommendationService.generateVehicleRecommendations(vehicleId));
    }

    @GetMapping("/my-vehicles")
    public ResponseEntity<Map<String, Object>> getMyVehiclesRecommendations(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByUserId(userDetails.getId());
        Map<String, Object> result = new HashMap<>();

        for (Vehicle v : vehicles) {
            List<RecommendationDto> recs = recommendationService.generateVehicleRecommendations(v.getId());
            Map<String, Object> vehicleData = new HashMap<>();
            vehicleData.put("vehicle", v);
            vehicleData.put("recommendations", recs);
            result.put(v.getRegistrationNumber(), vehicleData);
        }

        return ResponseEntity.ok(result);
    }
}
