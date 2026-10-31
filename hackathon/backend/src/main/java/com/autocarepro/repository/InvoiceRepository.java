package com.autocarepro.repository;

import com.autocarepro.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    Optional<Invoice> findByServiceRequestId(Long serviceRequestId);
    List<Invoice> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Invoice> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.paymentStatus = 'PAID'")
    BigDecimal calculateTotalPaidRevenue();

    @Query("SELECT FUNCTION('MONTH', i.invoiceDate), FUNCTION('YEAR', i.invoiceDate), COALESCE(SUM(i.totalAmount), 0) " +
           "FROM Invoice i WHERE i.paymentStatus = 'PAID' GROUP BY FUNCTION('YEAR', i.invoiceDate), FUNCTION('MONTH', i.invoiceDate) " +
           "ORDER BY FUNCTION('YEAR', i.invoiceDate) ASC, FUNCTION('MONTH', i.invoiceDate) ASC")
    List<Object[]> getMonthlyRevenueReport();
}
