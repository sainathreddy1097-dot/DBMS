package com.autocarepro.controller;

import com.autocarepro.entity.InventoryTransaction;
import com.autocarepro.entity.SparePart;
import com.autocarepro.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<SparePart>> getAllParts() {
        return ResponseEntity.ok(inventoryService.getAllParts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePart> getPartById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getPartById(id));
    }

    @PostMapping
    public ResponseEntity<SparePart> addPart(@RequestBody SparePart part) {
        return ResponseEntity.ok(inventoryService.addPart(part));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePart> updatePart(@PathVariable Long id, @RequestBody SparePart part) {
        return ResponseEntity.ok(inventoryService.updatePart(id, part));
    }

    @PostMapping("/{id}/issue")
    public ResponseEntity<InventoryTransaction> issuePart(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        int qty = Integer.parseInt(payload.getOrDefault("quantity", "1").toString());
        Long reqId = payload.containsKey("serviceRequestId") ? Long.parseLong(payload.get("serviceRequestId").toString()) : null;
        String notes = (String) payload.get("notes");
        return ResponseEntity.ok(inventoryService.issuePart(id, reqId, qty, notes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePart(@PathVariable Long id) {
        inventoryService.deletePart(id);
        return ResponseEntity.ok().build();
    }
}
