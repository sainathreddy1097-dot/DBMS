package com.autocarepro.service;

import com.autocarepro.dto.InvoiceCreateRequest;
import com.autocarepro.entity.*;
import com.autocarepro.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final PaymentRepository paymentRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          ServiceRequestRepository serviceRequestRepository,
                          PaymentRepository paymentRepository) {
        this.invoiceRepository = invoiceRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Invoice> getInvoicesByUser(Long userId) {
        return invoiceRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
    }

    public Invoice getInvoiceByServiceRequestId(Long requestId) {
        return invoiceRepository.findByServiceRequestId(requestId)
                .orElseThrow(() -> new RuntimeException("Invoice not found for service request: " + requestId));
    }

    @Transactional
    public Invoice createInvoice(InvoiceCreateRequest request) {
        ServiceRequest serviceRequest = serviceRequestRepository.findById(request.getServiceRequestId())
                .orElseThrow(() -> new RuntimeException("Service request not found: " + request.getServiceRequestId()));

        if (invoiceRepository.findByServiceRequestId(request.getServiceRequestId()).isPresent()) {
            throw new IllegalArgumentException("Invoice already exists for service request: " + request.getServiceRequestId());
        }

        BigDecimal labour = request.getLabourCharges() != null ? request.getLabourCharges() : BigDecimal.ZERO;
        BigDecimal parts = request.getSparePartsCharges() != null ? request.getSparePartsCharges() : BigDecimal.ZERO;
        BigDecimal subTotal = labour.add(parts);

        BigDecimal gstRate = request.getGstRate() != null ? request.getGstRate() : new BigDecimal("18.00");
        BigDecimal gstAmount = subTotal.multiply(gstRate).divide(new BigDecimal("100.00"), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subTotal.add(gstAmount);

        String invNum = "INV-" + LocalDate.now().getYear() + "-" + (1000 + new Random().nextInt(9000));
        while (invoiceRepository.findByInvoiceNumber(invNum).isPresent()) {
            invNum = "INV-" + LocalDate.now().getYear() + "-" + (1000 + new Random().nextInt(9000));
        }

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(invNum);
        invoice.setServiceRequest(serviceRequest);
        invoice.setUser(serviceRequest.getUser());
        invoice.setVehicle(serviceRequest.getVehicle());
        invoice.setLabourCharges(labour);
        invoice.setSparePartsCharges(parts);
        invoice.setGstRate(gstRate);
        invoice.setGstAmount(gstAmount);
        invoice.setTotalAmount(totalAmount);
        invoice.setPaymentStatus("PENDING");
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(7));

        List<InvoiceItem> items = new ArrayList<>();
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (InvoiceCreateRequest.InvoiceItemDto dto : request.getItems()) {
                BigDecimal qty = BigDecimal.valueOf(dto.getQuantity() != null ? dto.getQuantity() : 1);
                BigDecimal unitPrice = dto.getUnitPrice() != null ? dto.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal itemTotal = unitPrice.multiply(qty);

                InvoiceItem item = new InvoiceItem(invoice, dto.getItemType() != null ? dto.getItemType() : "LABOUR",
                        dto.getDescription(), dto.getQuantity() != null ? dto.getQuantity() : 1, unitPrice, itemTotal);
                items.add(item);
            }
        } else {
            // Default breakdown items
            if (labour.compareTo(BigDecimal.ZERO) > 0) {
                items.add(new InvoiceItem(invoice, "LABOUR", serviceRequest.getServiceCategory() + " Workmanship & Inspection", 1, labour, labour));
            }
            if (parts.compareTo(BigDecimal.ZERO) > 0) {
                items.add(new InvoiceItem(invoice, "PART", "Replacement Components & Consumables", 1, parts, parts));
            }
        }
        invoice.setItems(items);

        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Invoice markAsPaid(Long invoiceId, String paymentMethod) {
        Invoice invoice = getInvoiceById(invoiceId);
        invoice.setPaymentStatus("PAID");
        invoiceRepository.save(invoice);

        // Record payment
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setPaymentMethod(paymentMethod != null ? paymentMethod : "UPI");
        payment.setTransactionReference("PAY-" + System.currentTimeMillis() + "-" + (100 + new Random().nextInt(900)));
        payment.setAmount(invoice.getTotalAmount());
        payment.setPaymentStatus("SUCCESS");
        paymentRepository.save(payment);

        return invoice;
    }
}
