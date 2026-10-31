package com.autocarepro.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalCustomers;
    private long totalVehicles;
    private long totalBookings;
    private long pendingServices;
    private long activeRepairs;
    private long completedServices;
    private BigDecimal totalRevenue;
    private List<Map<String, Object>> recentBookings;
    private List<Map<String, Object>> monthlyRevenue;
    private List<Map<String, Object>> serviceCategories;

    public DashboardStatsResponse() {}

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getPendingServices() { return pendingServices; }
    public void setPendingServices(long pendingServices) { this.pendingServices = pendingServices; }

    public long getActiveRepairs() { return activeRepairs; }
    public void setActiveRepairs(long activeRepairs) { this.activeRepairs = activeRepairs; }

    public long getCompletedServices() { return completedServices; }
    public void setCompletedServices(long completedServices) { this.completedServices = completedServices; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<Map<String, Object>> getRecentBookings() { return recentBookings; }
    public void setRecentBookings(List<Map<String, Object>> recentBookings) { this.recentBookings = recentBookings; }

    public List<Map<String, Object>> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public List<Map<String, Object>> getServiceCategories() { return serviceCategories; }
    public void setServiceCategories(List<Map<String, Object>> serviceCategories) { this.serviceCategories = serviceCategories; }
}
