package com.autocarepro.controller;

import com.autocarepro.dto.InvoiceCreateRequest;
import com.autocarepro.entity.Invoice;
import com.autocarepro.entity.Role;
import com.autocarepro.entity.User;
import com.autocarepro.security.CustomUserDetails;
import com.autocarepro.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getInvoices(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        if (user.getRole() == Role.ROLE_ADMIN) {
            return ResponseEntity.ok(invoiceService.getAllInvoices());
        } else {
            return ResponseEntity.ok(invoiceService.getInvoicesByUser(user.getId()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<Invoice> getInvoiceByServiceRequestId(@PathVariable Long requestId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByServiceRequestId(requestId));
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody InvoiceCreateRequest request) {
        return ResponseEntity.ok(invoiceService.createInvoice(request));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Invoice> payInvoice(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        String method = payload != null ? payload.getOrDefault("paymentMethod", "UPI") : "UPI";
        return ResponseEntity.ok(invoiceService.markAsPaid(id, method));
    }
}
