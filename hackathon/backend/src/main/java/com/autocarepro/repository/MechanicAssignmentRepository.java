package com.autocarepro.repository;

import com.autocarepro.entity.MechanicAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MechanicAssignmentRepository extends JpaRepository<MechanicAssignment, Long> {
    List<MechanicAssignment> findByServiceRequestId(Long serviceRequestId);
    List<MechanicAssignment> findByMechanicIdAndStatus(Long mechanicId, String status);
}
