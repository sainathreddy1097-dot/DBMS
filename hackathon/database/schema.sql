-- AutoCare Pro - MySQL Database Schema
-- Smart Vehicle Service & Maintenance Management Platform
-- CodeSpark Hackathon 2026

CREATE DATABASE IF NOT EXISTS autocare_pro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autocare_pro_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('ROLE_CUSTOMER', 'ROLE_ADMIN', 'ROLE_MECHANIC') NOT NULL DEFAULT 'ROLE_CUSTOMER',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. Mechanics Profile Table
CREATE TABLE IF NOT EXISTS mechanics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    availability_status ENUM('AVAILABLE', 'BUSY', 'ON_LEAVE') DEFAULT 'AVAILABLE',
    active_jobs_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 4.80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mechanic_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacturing_year INT NOT NULL,
    fuel_type ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG') NOT NULL,
    current_mileage INT NOT NULL DEFAULT 0,
    vehicle_category ENUM('HATCHBACK', 'SEDAN', 'SUV', 'LUXURY', 'COMMERCIAL', 'BIKE') NOT NULL DEFAULT 'SEDAN',
    last_service_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vehicle_reg (registration_number),
    CONSTRAINT fk_vehicle_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Spare Parts Inventory Table
CREATE TABLE IF NOT EXISTS spare_parts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    part_number VARCHAR(50) NOT NULL UNIQUE,
    part_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_part_num (part_number)
) ENGINE=InnoDB;

-- 5. Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    service_category VARCHAR(100) NOT NULL,
    problem_description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    status ENUM('BOOKED', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'REJECTED') DEFAULT 'BOOKED',
    estimated_cost DECIMAL(10,2) DEFAULT 0.00,
    mechanic_id BIGINT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_req_ref (booking_reference),
    INDEX idx_req_status (status),
    CONSTRAINT fk_request_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_mechanic FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Mechanic Assignments Table
CREATE TABLE IF NOT EXISTS mechanic_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_request_id BIGINT NOT NULL,
    mechanic_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ACTIVE', 'REASSIGNED', 'COMPLETED') DEFAULT 'ACTIVE',
    notes TEXT,
    CONSTRAINT fk_assign_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_assign_mechanic FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Service Updates / Work Log Table
CREATE TABLE IF NOT EXISTS service_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_request_id BIGINT NOT NULL,
    mechanic_id BIGINT,
    status VARCHAR(50) NOT NULL,
    notes TEXT NOT NULL,
    parts_replaced TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_update_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_update_mechanic FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Inventory Transactions Table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    part_id BIGINT NOT NULL,
    service_request_id BIGINT,
    transaction_type ENUM('IN', 'OUT') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    notes VARCHAR(255),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trans_part FOREIGN KEY (part_id) REFERENCES spare_parts(id) ON DELETE CASCADE,
    CONSTRAINT fk_trans_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    service_request_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    labour_charges DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    spare_parts_charges DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    gst_rate DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    gst_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('PENDING', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
    invoice_date DATE NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inv_num (invoice_number),
    CONSTRAINT fk_inv_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_type ENUM('LABOUR', 'PART') NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Maintenance Records Table (Historical & Predictive)
CREATE TABLE IF NOT EXISTS maintenance_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    service_request_id BIGINT,
    service_date DATE NOT NULL,
    mileage INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    details TEXT,
    next_service_due_date DATE,
    next_service_due_mileage INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_maint_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_maint_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 12. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'CASH') NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('SUCCESS', 'FAILED', 'PENDING') DEFAULT 'SUCCESS',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;
