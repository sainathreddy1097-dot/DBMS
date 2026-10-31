package com.autocarepro.repository;

import com.autocarepro.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Optional<ServiceRequest> findByBookingReference(String bookingReference);
    List<ServiceRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ServiceRequest> findByMechanicIdOrderByCreatedAtDesc(Long mechanicId);
    List<ServiceRequest> findByStatus(String status);
    List<ServiceRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);

    @Query("SELECT s.serviceCategory, COUNT(s) FROM ServiceRequest s GROUP BY s.serviceCategory")
    List<Object[]> countByServiceCategoryGroup();
}
