# AutoCare Pro – Entity-Relationship (ER) Diagram

## Database Specification
- **Engine**: MySQL 9.7 (InnoDB)
- **Database Name**: `autocare_pro_db`
- **Total Relational Entities**: 12 Normalized Tables
- **Constraints**: Foreign Key constraints with `CASCADE` and `SET NULL` referential integrity

```mermaid
erDiagram
    USERS ||--o{ VEHICLES : "owns"
    USERS ||--o{ SERVICE_REQUESTS : "books"
    USERS ||--o| MECHANICS : "profile"
    USERS ||--o{ INVOICES : "billed_to"
    
    VEHICLES ||--o{ SERVICE_REQUESTS : "scheduled_for"
    VEHICLES ||--o{ INVOICES : "serviced"
    VEHICLES ||--o{ MAINTENANCE_RECORDS : "history"
    
    MECHANICS ||--o{ SERVICE_REQUESTS : "assigned_to"
    MECHANICS ||--o{ MECHANIC_ASSIGNMENTS : "dispatched"
    MECHANICS ||--o{ SERVICE_UPDATES : "logs_progress"
    
    SERVICE_REQUESTS ||--o{ MECHANIC_ASSIGNMENTS : "allocations"
    SERVICE_REQUESTS ||--o{ SERVICE_UPDATES : "timeline"
    SERVICE_REQUESTS ||--o| INVOICES : "settled_by"
    SERVICE_REQUESTS ||--o{ INVENTORY_TRANSACTIONS : "consumes"
    SERVICE_REQUESTS ||--o{ MAINTENANCE_RECORDS : "generates"
    
    INVOICES ||--|{ INVOICE_ITEMS : "contains"
    INVOICES ||--o{ PAYMENTS : "receipts"
    
    SPARE_PARTS ||--o{ INVENTORY_TRANSACTIONS : "stock_movement"

    USERS {
        BIGINT id PK
        VARCHAR full_name
        VARCHAR email UK
        VARCHAR password
        VARCHAR phone
        ENUM role "ROLE_CUSTOMER, ROLE_ADMIN, ROLE_MECHANIC"
        TEXT address
        TIMESTAMP created_at
    }

    VEHICLES {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR registration_number UK
        VARCHAR manufacturer
        VARCHAR model
        INT manufacturing_year
        ENUM fuel_type
        INT current_mileage
        ENUM vehicle_category
        DATE last_service_date
    }

    MECHANICS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR specialization
        INT experience_years
        ENUM availability_status
        INT active_jobs_count
        DECIMAL rating
    }

    SERVICE_REQUESTS {
        BIGINT id PK
        VARCHAR booking_reference UK
        BIGINT user_id FK
        BIGINT vehicle_id FK
        VARCHAR service_category
        TEXT problem_description
        DATE preferred_date
        ENUM status "BOOKED, APPROVED, ASSIGNED, IN_PROGRESS, COMPLETED, DELIVERED, REJECTED"
        DECIMAL estimated_cost
        BIGINT mechanic_id FK
        TEXT admin_notes
    }

    MECHANIC_ASSIGNMENTS {
        BIGINT id PK
        BIGINT service_request_id FK
        BIGINT mechanic_id FK
        BIGINT assigned_by_user_id
        TIMESTAMP assigned_at
        ENUM status
        TEXT notes
    }

    SERVICE_UPDATES {
        BIGINT id PK
        BIGINT service_request_id FK
        BIGINT mechanic_id FK
        VARCHAR status
        TEXT notes
        TEXT parts_replaced
        TIMESTAMP updated_at
    }

    SPARE_PARTS {
        BIGINT id PK
        VARCHAR part_number UK
        VARCHAR part_name
        VARCHAR category
        DECIMAL unit_price
        INT stock_quantity
        INT reorder_level
    }

    INVENTORY_TRANSACTIONS {
        BIGINT id PK
        BIGINT part_id FK
        BIGINT service_request_id FK
        ENUM transaction_type "IN, OUT"
        INT quantity
        DECIMAL unit_price
        TIMESTAMP transaction_date
    }

    INVOICES {
        BIGINT id PK
        VARCHAR invoice_number UK
        BIGINT service_request_id FK
        BIGINT user_id FK
        BIGINT vehicle_id FK
        DECIMAL labour_charges
        DECIMAL spare_parts_charges
        DECIMAL gst_rate
        DECIMAL gst_amount
        DECIMAL total_amount
        ENUM payment_status "PENDING, PAID, CANCELLED"
        DATE invoice_date
        DATE due_date
    }

    INVOICE_ITEMS {
        BIGINT id PK
        BIGINT invoice_id FK
        ENUM item_type "LABOUR, PART"
        VARCHAR description
        INT quantity
        DECIMAL unit_price
        DECIMAL total_price
    }

    PAYMENTS {
        BIGINT id PK
        BIGINT invoice_id FK
        ENUM payment_method "UPI, CREDIT_CARD, NET_BANKING, CASH"
        VARCHAR transaction_reference UK
        DECIMAL amount
        ENUM payment_status
        TIMESTAMP payment_date
    }

    MAINTENANCE_RECORDS {
        BIGINT id PK
        BIGINT vehicle_id FK
        BIGINT service_request_id FK
        DATE service_date
        INT mileage
        VARCHAR service_type
        TEXT details
        DATE next_service_due_date
        INT next_service_due_mileage
    }
```
