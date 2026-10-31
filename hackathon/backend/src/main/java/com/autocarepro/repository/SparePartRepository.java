package com.autocarepro.repository;

import com.autocarepro.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    Optional<SparePart> findByPartNumber(String partNumber);
    List<SparePart> findByCategory(String category);
}
