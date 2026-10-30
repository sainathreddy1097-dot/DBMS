package com.autocarepro.service;

import com.autocarepro.entity.InventoryTransaction;
import com.autocarepro.entity.ServiceRequest;
import com.autocarepro.entity.SparePart;
import com.autocarepro.repository.InventoryTransactionRepository;
import com.autocarepro.repository.ServiceRequestRepository;
import com.autocarepro.repository.SparePartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final SparePartRepository sparePartRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    public InventoryService(SparePartRepository sparePartRepository,
                            InventoryTransactionRepository transactionRepository,
                            ServiceRequestRepository serviceRequestRepository) {
        this.sparePartRepository = sparePartRepository;
        this.transactionRepository = transactionRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public List<SparePart> getAllParts() {
        return sparePartRepository.findAll();
    }

    public SparePart getPartById(Long id) {
        return sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + id));
    }

    @Transactional
    public SparePart addPart(SparePart part) {
        return sparePartRepository.save(part);
    }

    @Transactional
    public SparePart updatePart(Long id, SparePart updated) {
        SparePart existing = getPartById(id);
        existing.setPartName(updated.getPartName());
        existing.setCategory(updated.getCategory());
        existing.setUnitPrice(updated.getUnitPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setReorderLevel(updated.getReorderLevel());
        return sparePartRepository.save(existing);
    }

    @Transactional
    public InventoryTransaction issuePart(Long partId, Long requestId, int quantity, String notes) {
        SparePart part = getPartById(partId);
        if (part.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient inventory! Available: " + part.getStockQuantity() + ", requested: " + quantity);
        }

        part.setStockQuantity(part.getStockQuantity() - quantity);
        sparePartRepository.save(part);

        ServiceRequest req = requestId != null ? serviceRequestRepository.findById(requestId).orElse(null) : null;

        InventoryTransaction tx = new InventoryTransaction();
        tx.setSparePart(part);
        tx.setServiceRequest(req);
        tx.setTransactionType("OUT");
        tx.setQuantity(quantity);
        tx.setUnitPrice(part.getUnitPrice());
        tx.setNotes(notes != null ? notes : "Issued for service request " + (req != null ? req.getBookingReference() : ""));

        return transactionRepository.save(tx);
    }

    @Transactional
    public void deletePart(Long id) {
        sparePartRepository.deleteById(id);
    }
}
