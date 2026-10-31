package com.autocarepro.controller;

import com.autocarepro.dto.DashboardStatsResponse;
import com.autocarepro.entity.Role;
import com.autocarepro.entity.User;
import com.autocarepro.repository.UserRepository;
import com.autocarepro.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public AnalyticsController(AnalyticsService analyticsService, UserRepository userRepository) {
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<DashboardStatsResponse> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminDashboardStats());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<User>> getCustomers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.ROLE_CUSTOMER));
    }
}
