# AutoCare Pro – Smart Vehicle Service & Maintenance Management Platform

> **CODESPARK HACKATHON 2026** • KL University, Bachupally Campus  
> **Problem Statement 05** – Vehicle Service Management Platform  
> **Tagline**: *Smart Service. Better Performance. Safer Journeys.*

---

## 🚀 Live Application URLs

| Service | Technology | Port / URL | Status |
|---|---|---|---|
| **Frontend Portal** | React.js 18 + Tailwind CSS + Vite | [http://localhost:3000](http://localhost:3000) | **LIVE & ACTIVE** |
| **Backend REST APIs** | Java 21 + Spring Boot 3.3.4 + Spring Security | [http://localhost:8080](http://localhost:8080) | **LIVE & ACTIVE** |
| **Database** | MySQL 9.7 (InnoDB Relational DB) | `localhost:3306` (`autocare_pro_db`) | **LIVE & ACTIVE** |
| **AI Maintenance Engine** | Python Predictive Microservice | [http://localhost:5001](http://localhost:5001) | **LIVE & ACTIVE** |

---

## ⚡ 1-Click Demo Login Credentials

Pre-configured and verified test accounts (available directly via 1-click Quick Fill buttons on `/login`):

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Admin** | `admin@autocare.com` | `admin123` | Analytics Hub, Service Dispatch, Mechanic Assignments, Inventory Control, Invoices & Revenue |
| **Mechanic** | `ramesh@autocare.com` | `mechanic123` | Tech Terminal, Assigned Bay Orders, Diagnostic Logging, Spare Parts Usage, Job Completion |
| **Customer** | `sainath@example.com` | `customer123` | Garage Fleet, 9 Service Bookings, Live Lifecycle Tracking, Printable GST Invoices, AI Alerts |
| **Customer 2** | `priya@example.com` | `customer123` | Alternative customer account with electric vehicle & bike profiles |

---

## 🌟 Architecture & Technology Stack

### Frontend:
- **React.js 18** (Modern functional components, hooks)
- **Tailwind CSS 3** (Custom automotive palette: Navy Blue `#0a192f`, Slate, Electric Cyan `#06b6d4`)
- **React Router 6** (Role-based Protected Routes)
- **Axios** (Stateless Bearer JWT request/response interceptors)
- **Recharts** (Interactive Area Charts for Revenue and Pie Charts for Category Breakdown)
- **Lucide Icons** (Clean, automotive glyphs)

### Backend:
- **Java 21 (OpenJDK 25 Runtime)**
- **Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate** (ORM, automated table synchronization)
- **Spring Security 6** (BCrypt password encoding, stateless JWT token authentication)
- **JJWT 0.12.6** (HMAC-SHA384 encrypted token claims)
- **Maven 3.9.6**

### Database:
- **MySQL 9.7** (12 Normalized tables with foreign keys and cascade rules)

### AI Service:
- **Python 3.14** (Explainable Wear Lifecycle Prediction Engine)

---

## 📋 Completed Mandatory Features Checklist

- [x] **1. Customer & Vehicle Profiles**: Register multiple multi-segment vehicles (Hatchback, Sedan, SUV, Luxury, Commercial, Two-Wheeler) with fuel type, odometer mileage, and last service date.
- [x] **2. Service Requests**: Full catalog of 9 specialized services (General Servicing, Oil Change, Engine Repair, Brake Inspection, Wheel Alignment, Battery Replacement, AC Service, Tyre Replacement, Full Inspection) with system-generated unique reference IDs (`AP-2026-XXXX`).
- [x] **3. Mechanic Assignment**: Workshop dispatch console for allocating lead technicians, monitoring mechanic workloads, experience levels, and customer ratings.
- [x] **4. End-to-End Service Tracking**: Real-time 6-milestone lifecycle tracking:
  $$\text{BOOKED} \longrightarrow \text{APPROVED} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN PROGRESS} \longrightarrow \text{COMPLETED} \longrightarrow \text{DELIVERED}$$
- [x] **5. Invoice Generation**: Automated calculation of labour charges, spare-parts charges, 18% statutory GST, total payable, and 1-click printable tax receipts.
- [x] **6. Service History**: Historical maintenance audit trails linking odometer milestones, parts replaced, and future recommended dates.
- [x] **7. Admin Analytics Dashboard**: Live database-driven KPIs, Recharts monthly revenue area chart, category pie chart, and recent active work orders.
- [x] **8. Spare Parts Inventory**: Real-time stock levels, low-stock alerts below reorder thresholds, and parts consumption deduction on repair orders.
- [x] **9. AI Maintenance Predictor**: Transparent, explainable automotive wear prediction engine analyzing mileage intervals and operational degradation curves.

---

## 📁 Project Directory Structure

```
autocare-pro/
├── backend/                              # Java Spring Boot 3.3 Backend
│   ├── pom.xml                           # Maven dependencies (JPA, Security, JJWT, MySQL)
│   └── src/main/
│       ├── java/com/autocarepro/
│       │   ├── AutoCareProApplication.java
│       │   ├── config/                   # SecurityConfig, DataInitializer, CORS
│       │   ├── controller/               # REST API endpoints (Auth, Vehicle, Requests, etc.)
│       │   ├── dto/                      # Data Transfer Objects
│       │   ├── entity/                   # 12 Relational JPA Entities
│       │   ├── repository/               # Spring Data JPA Repositories
│       │   ├── security/                 # JWT Provider, Custom User Details
│       │   └── service/                  # Business Logic & Calculations
│       └── resources/
│           └── application.properties    # MySQL & JWT configuration
├── frontend/                             # React 18 + Tailwind CSS + Vite
│   ├── package.json
│   ├── vite.config.js                    # Reverse proxy to port 8080
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── context/AuthContext.jsx       # Global Auth & Role State
│       ├── services/api.js               # Axios client with JWT bearer interceptor
│       ├── components/common/            # Navbar, Sidebar, StatusBadge, WorkflowProgress, InvoiceModal
│       ├── pages/public/                 # Landing, Services, Login, Register
│       ├── pages/customer/               # Dashboard, Garage, Booking, Tracking, Invoices, AI Alerts
│       ├── pages/admin/                  # Analytics, Dispatch, Mechanics, Inventory, Billing, Customers
│       └── pages/mechanic/               # Bay Dashboard, Assigned Jobs, Work Log & Parts
├── ai-service/                           # Explainable AI Microservice
│   ├── predictor.py                      # Automotive wear rule-based prediction engine
│   └── app.py                            # Python HTTP Microservice (:5001)
├── database/                             # Database Artifacts
│   ├── schema.sql                        # Normalized DDL script (12 tables)
│   └── seed.sql                          # Comprehensive sample dataset
├── docs/                                 # Architectural Documentation
│   ├── ARCHITECTURE.md                   # System Architecture & Component Diagram
│   ├── ER_DIAGRAM.md                     # Complete Mermaid Relational Entity Diagram
│   └── API_DOCUMENTATION.md              # REST API Specification
└── README.md                             # Hackathon Master Documentation
```

---

## 🛠️ Step-by-Step Execution Guide

### 1. Database Setup
```bash
# Apply schema and seed data into MySQL
mysql -u root -p5455 < database/schema.sql
mysql -u root -p5455 < database/seed.sql
```

### 2. Run Spring Boot Backend
```bash
cd backend
mvn clean compile
mvn spring-boot:run
# Server launches on http://localhost:8080
```

### 3. Run React Frontend
```bash
cd frontend
npm install
npm run dev
# Web application launches on http://localhost:3000
```

### 4. Run AI Maintenance Service
```bash
cd ai-service
python app.py
# Microservice launches on http://localhost:5001
```

---

## 🧪 Verified Test Results

| Test Scenario | Input / Action | Verified Result |
|---|---|---|
| **Admin Authentication** | POST `/api/auth/login` (`admin@autocare.com`) | `200 OK`, JWT token generated with `ROLE_ADMIN` claim |
| **Mechanic Authentication** | POST `/api/auth/login` (`ramesh@autocare.com`) | `200 OK`, JWT token generated with `ROLE_MECHANIC` claim |
| **Customer Authentication** | POST `/api/auth/login` (`sainath@example.com`) | `200 OK`, JWT token generated with `ROLE_CUSTOMER` claim |
| **Analytics Aggregation** | GET `/api/admin/analytics` | Database dynamically calculates ₹14,986 revenue, 5 bookings, 4 vehicles, and monthly trends |
| **Service Booking** | Customer books General Servicing for Creta SX | Unique reference `AP-2026-XXXX` generated, status initialized to `BOOKED` |
| **Workflow Advancement** | Admin assigns mechanic; Mechanic logs parts | `BOOKED -> APPROVED -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> DELIVERED` verified |
| **Invoice Calculation** | Labour: ₹2200, Parts: ₹4300, 18% GST: ₹1170 | Total ₹7670 correctly calculated; Payment marked `PAID` via UPI |
| **AI Prediction** | Vehicle with 34,500 km and 8 months elapsed | Forecasts Oil Change due & Starter Battery load diagnostic |

---

*AutoCare Pro – Engineered for CODESPARK HACKATHON 2026 at KL University.*
