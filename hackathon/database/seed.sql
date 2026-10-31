-- AutoCare Pro - Seed Data
-- CodeSpark Hackathon 2026

USE autocare_pro_db;

-- 1. Users (Passwords: admin123, mechanic123, customer123)
-- BCrypt encoded values will also be initialized/refreshed by Spring Boot DataInitializer on startup
INSERT INTO users (id, full_name, email, password, phone, role, address) VALUES
(1, 'System Administrator', 'admin@autocare.com', '$2a$10$4n9U6vTqy8c3sBsmh5VjEuZ.K2R3A9WqL0q1v4wZqG9vO8kF3eMfa', '+91 98765 43210', 'ROLE_ADMIN', 'Tech Park, HITEC City, Hyderabad'),
(2, 'Ramesh Kumar (Senior Tech)', 'ramesh@autocare.com', '$2a$10$4n9U6vTqy8c3sBsmh5VjEuZ.K2R3A9WqL0q1v4wZqG9vO8kF3eMfa', '+91 98765 11111', 'ROLE_MECHANIC', 'Kukatpally, Hyderabad'),
(3, 'Suresh Reddy (Master Electrician)', 'suresh@autocare.com', '$2a$10$4n9U6vTqy8c3sBsmh5VjEuZ.K2R3A9WqL0q1v4wZqG9vO8kF3eMfa', '+91 98765 22222', 'ROLE_MECHANIC', 'Bachupally, Hyderabad'),
(4, 'Sainath Reddy', 'sainath@example.com', '$2a$10$4n9U6vTqy8c3sBsmh5VjEuZ.K2R3A9WqL0q1v4wZqG9vO8kF3eMfa', '+91 98765 33333', 'ROLE_CUSTOMER', 'Miyapur, Hyderabad'),
(5, 'Priya Sharma', 'priya@example.com', '$2a$10$4n9U6vTqy8c3sBsmh5VjEuZ.K2R3A9WqL0q1v4wZqG9vO8kF3eMfa', '+91 98765 44444', 'ROLE_CUSTOMER', 'Gachibowli, Hyderabad')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Mechanics
INSERT INTO mechanics (id, user_id, specialization, experience_years, availability_status, active_jobs_count, rating) VALUES
(1, 2, 'Engine Overhaul & Transmission Specialist', 8, 'AVAILABLE', 1, 4.90),
(2, 3, 'Electrical Diagnostics & AC Systems', 6, 'AVAILABLE', 1, 4.85)
ON DUPLICATE KEY UPDATE specialization=VALUES(specialization);

-- 3. Vehicles
INSERT INTO vehicles (id, user_id, registration_number, manufacturer, model, manufacturing_year, fuel_type, current_mileage, vehicle_category, last_service_date) VALUES
(1, 4, 'TS09EA1234', 'Hyundai', 'Creta SX(O)', 2022, 'PETROL', 34500, 'SUV', '2026-05-15'),
(2, 4, 'TS08FB5678', 'Honda', 'City ZX CVT', 2021, 'PETROL', 48200, 'SEDAN', '2026-04-10'),
(3, 5, 'TS07HC9999', 'Tata', 'Nexon EV Empowered', 2023, 'ELECTRIC', 18400, 'SUV', '2026-07-20'),
(4, 5, 'TS10JK4321', 'Royal Enfield', 'Classic 350', 2020, 'PETROL', 26100, 'BIKE', '2026-02-18')
ON DUPLICATE KEY UPDATE current_mileage=VALUES(current_mileage);

-- 4. Spare Parts Inventory
INSERT INTO spare_parts (id, part_number, part_name, category, unit_price, stock_quantity, reorder_level) VALUES
(1, 'SP-OIL-5W30', 'Synthec 5W-30 Full Synthetic Engine Oil (4L)', 'Fluids & Lubricants', 3200.00, 45, 10),
(2, 'SP-FLT-OIL01', 'High Flow Premium Oil Filter', 'Filters', 450.00, 60, 15),
(3, 'SP-FLT-AIR02', 'Active Carbon Air Cleaner Element', 'Filters', 650.00, 35, 10),
(4, 'SP-FLT-AC03', 'HEPA Cabin AC Filter', 'Filters', 850.00, 28, 8),
(5, 'SP-BRK-PAD-F', 'Ceramic Front Brake Pad Set', 'Brakes', 2400.00, 20, 5),
(6, 'SP-BRK-DISC', 'Ventilated Front Brake Disc Rotor (Pair)', 'Brakes', 4800.00, 12, 4),
(7, 'SP-BAT-45AH', 'Exide 12V 45Ah Maintenance-Free Battery', 'Electrical', 5500.00, 15, 3),
(8, 'SP-WIP-SET', 'Aerodynamic Silicone Wiper Blades (Set)', 'Body Parts', 950.00, 40, 10),
(9, 'SP-SPK-IRID', 'NGK Laser Iridium Spark Plug (Pack of 4)', 'Ignition', 2200.00, 25, 6),
(10, 'SP-COOL-GLY', 'Long-Life Glycol Coolant (2L Premix)', 'Fluids & Lubricants', 750.00, 50, 12)
ON DUPLICATE KEY UPDATE unit_price=VALUES(unit_price);

-- 5. Service Requests
INSERT INTO service_requests (id, booking_reference, user_id, vehicle_id, service_category, problem_description, preferred_date, status, estimated_cost, mechanic_id, admin_notes) VALUES
(1, 'AP-2026-1001', 4, 1, 'General Servicing', 'Scheduled 35,000km periodic maintenance. Squeaking noise from front right brake on cold start.', '2026-10-25', 'COMPLETED', 6500.00, 1, 'Approved and assigned to Ramesh. Completed test drive.'),
(2, 'AP-2026-1002', 4, 2, 'Brake Inspection', 'Brake pedal feels spongy during hard braking, steering vibration above 80 km/h.', '2026-10-28', 'IN_PROGRESS', 4200.00, 1, 'Inspecting brake pads and rotors.'),
(3, 'AP-2026-1003', 5, 3, 'AC Service', 'Cabin cooling is weak on hot afternoons. Mild damp odor when blower initiates.', '2026-10-29', 'ASSIGNED', 2800.00, 2, 'Assigned to Suresh for AC coil and gas pressure check.'),
(4, 'AP-2026-1004', 5, 4, 'Engine Repair', 'Engine misfiring in 2nd gear, chain slack sound.', '2026-10-31', 'BOOKED', 3000.00, NULL, 'Pending admin verification.'),
(5, 'AP-2026-1005', 4, 1, 'Battery Replacement', 'Battery voltage dropping, auto start-stop system disabled.', '2026-10-20', 'DELIVERED', 6200.00, 2, 'Replaced 45Ah battery and recalibrated BMS.')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 6. Mechanic Assignments
INSERT INTO mechanic_assignments (id, service_request_id, mechanic_id, assigned_by_user_id, status, notes) VALUES
(1, 1, 1, 1, 'COMPLETED', 'Complete routine service and brake inspection done.'),
(2, 2, 1, 1, 'ACTIVE', 'Diagnose brake pad wear and rotor runout.'),
(3, 3, 2, 1, 'ACTIVE', 'Check refrigerant leak and cabin filter.'),
(4, 5, 2, 1, 'COMPLETED', 'Battery test completed and replacement installed.')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 7. Service Updates
INSERT INTO service_updates (id, service_request_id, mechanic_id, status, notes, parts_replaced) VALUES
(1, 1, 1, 'IN_PROGRESS', 'Vehicle mounted on lift. Drained old synthetic engine oil and removed old filter.', 'SP-OIL-5W30, SP-FLT-OIL01'),
(2, 1, 1, 'COMPLETED', 'Cleaned brake pads, topped up fluids, 35-point safety check cleared.', 'SP-FLT-AIR02'),
(3, 2, 1, 'IN_PROGRESS', 'Disassembled front callipers. Rotors have 0.8mm disc runout requiring resurfacing/replacement.', 'SP-BRK-PAD-F'),
(4, 5, 2, 'COMPLETED', 'Tested altenator output (14.2V healthy). New Exide battery installed and coded to ECU.', 'SP-BAT-45AH')
ON DUPLICATE KEY UPDATE notes=VALUES(notes);

-- 8. Invoices
INSERT INTO invoices (id, invoice_number, service_request_id, user_id, vehicle_id, labour_charges, spare_parts_charges, gst_rate, gst_amount, total_amount, payment_status, invoice_date, due_date) VALUES
(1, 'INV-2026-0001', 1, 4, 1, 2200.00, 4300.00, 18.00, 1170.00, 7670.00, 'PAID', '2026-10-25', '2026-10-25'),
(2, 'INV-2026-0002', 5, 4, 1, 700.00, 5500.00, 18.00, 1116.00, 7316.00, 'PAID', '2026-10-20', '2026-10-20'),
(3, 'INV-2026-0003', 2, 4, 2, 1200.00, 2400.00, 18.00, 648.00, 4248.00, 'PENDING', '2026-10-28', '2026-11-04')
ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);

-- 9. Invoice Items
INSERT INTO invoice_items (id, invoice_id, item_type, description, quantity, unit_price, total_price) VALUES
(1, 1, 'LABOUR', '35,000 KM Periodic Service Labour Charges', 1, 2200.00, 2200.00),
(2, 1, 'PART', 'Synthec 5W-30 Full Synthetic Engine Oil (4L)', 1, 3200.00, 3200.00),
(3, 1, 'PART', 'High Flow Premium Oil Filter', 1, 450.00, 450.00),
(4, 1, 'PART', 'Active Carbon Air Cleaner Element', 1, 650.00, 650.00),
(5, 2, 'LABOUR', 'Battery Diagnostic & Terminal Coding Labour', 1, 700.00, 700.00),
(6, 2, 'PART', 'Exide 12V 45Ah Maintenance-Free Battery', 1, 5500.00, 5500.00),
(7, 3, 'LABOUR', 'Brake Rotor Resurfacing and Calliper Service', 1, 1200.00, 1200.00),
(8, 3, 'PART', 'Ceramic Front Brake Pad Set', 1, 2400.00, 2400.00)
ON DUPLICATE KEY UPDATE total_price=VALUES(total_price);

-- 10. Payments
INSERT INTO payments (id, invoice_id, payment_method, transaction_reference, amount, payment_status, payment_date) VALUES
(1, 1, 'UPI', 'UPI-TXN-20261025-998811', 7670.00, 'SUCCESS', '2026-10-25 16:45:00'),
(2, 2, 'CREDIT_CARD', 'CC-AUTH-20261020-443322', 7316.00, 'SUCCESS', '2026-10-20 18:20:00')
ON DUPLICATE KEY UPDATE amount=VALUES(amount);

-- 11. Maintenance Records
INSERT INTO maintenance_records (id, vehicle_id, service_request_id, service_date, mileage, service_type, details, next_service_due_date, next_service_due_mileage) VALUES
(1, 1, 1, '2026-10-25', 34500, 'General Servicing', 'Full synthetic oil renewal, air filter replacement, 35-point safety check passed.', '2027-04-25', 44500),
(2, 1, 5, '2026-10-20', 34100, 'Battery Replacement', 'Replaced stock battery with Exide 12V 45Ah.', '2029-10-20', 80000),
(3, 2, NULL, '2026-04-10', 40000, 'Periodic Maintenance', 'Transmission fluid flush, spark plug replacement.', '2026-10-10', 50000)
ON DUPLICATE KEY UPDATE mileage=VALUES(mileage);
