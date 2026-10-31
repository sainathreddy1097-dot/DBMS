package com.autocarepro.repository;

import com.autocarepro.entity.ServiceUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceUpdateRepository extends JpaRepository<ServiceUpdate, Long> {
    List<ServiceUpdate> findByServiceRequestIdOrderByUpdatedAtDesc(Long serviceRequestId);
}
