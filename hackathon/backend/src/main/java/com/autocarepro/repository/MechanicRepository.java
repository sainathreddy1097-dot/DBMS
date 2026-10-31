package com.autocarepro.repository;

import com.autocarepro.entity.Mechanic;
import com.autocarepro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {
    Optional<Mechanic> findByUser(User user);
    Optional<Mechanic> findByUserId(Long userId);
    List<Mechanic> findByAvailabilityStatus(String status);
}
