package com.autocarepro.repository;

import com.autocarepro.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findBySparePartId(Long partId);
    List<InventoryTransaction> findByServiceRequestId(Long serviceRequestId);
}
