# AutoCare Pro – System Architecture

## Architectural Blueprint
AutoCare Pro is architected as an automotive SaaS application adhering to 3-tier enterprise standards:
1. **Presentation Layer**: React.js 18 with Tailwind CSS, Lucide Icons, and Recharts
2. **Application Layer**: Java 21 Spring Boot 3.3 RESTful Microservices with Spring Security & JJWT
3. **Persistence Layer**: MySQL 9.7 with Hibernate ORM & Spring Data JPA
4. **Predictive AI Layer**: Explainable Automotive Wear Intelligence Engine (Python Microservice + Embedded Java Fallback)

```mermaid
flowchart TD
    subgraph Client ["Frontend Tier (React + Vite :3000)"]
        UI["Automotive SaaS UI"]
        CP["Customer Portal"]
        AP["Admin Dispatch Hub"]
        MP["Technician Bay View"]
        RC["Recharts Analytics"]
        AX["Axios Interceptor + JWT"]
    end

    subgraph Security ["Security & Gateway Layer"]
        AUTH["Spring Security 6"]
        JWT["Stateless JWT Token Filter"]
        CORS["CORS Policy Enforcement"]
    end

    subgraph Backend ["Backend Tier (Spring Boot 3.3.4 :8080)"]
        REST["REST API Controllers"]
        
        subgraph Services ["Service Orchestration"]
            AS["AuthService"]
            VS["VehicleService"]
            SRS["ServiceRequestService"]
            MS["MechanicService"]
            IS["InvoiceService"]
            INV["InventoryService"]
            ANS["AnalyticsService"]
            RS["RecommendationService"]
        end
        
        JPA["Spring Data JPA Repositories"]
    end

    subgraph Database ["Persistence Tier (MySQL 9.7 :3306)"]
        DB[(autocare_pro_db)]
        T1[users]
        T2[vehicles]
        T3[service_requests]
        T4[mechanics]
        T5[invoices & items]
        T6[spare_parts]
        T7[maintenance_records]
    end

    subgraph AIService ["AI Prediction Service (:5001)"]
        PY["Python REST Microservice"]
        RULES["Wear Lifecycle Engine"]
    end

    UI --> AX
    AX -->|Bearer JWT HTTP Requests| CORS
    CORS --> JWT
    JWT --> AUTH
    AUTH --> REST
    REST --> Services
    Services --> JPA
    JPA -->|HikariCP Connection Pool| DB
    DB --- T1
    DB --- T2
    DB --- T3
    DB --- T4
    DB --- T5
    DB --- T6
    DB --- T7

    RS -.->|Optional AI Telemetry Query| PY
    PY --> RULES
```

## Key Architectural Principles
- **Separation of Concerns**: Strict boundary between business logic (`@Service`), data abstraction (`@Repository`), and HTTP transport (`@RestController`).
- **Stateless Authorization**: JWT token claims (`sub`, `userId`, `role`, `fullName`) eliminate server-side session state and enable horizontal scaling.
- **Workflow State Machine**: Strictly validates milestone transitions (`BOOKED -> APPROVED -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> DELIVERED`).
- **Transactional Consistency**: `@Transactional` ensures atomic updates when issuing inventory, billing invoices, or completing work orders.
