# AutoCare Pro – REST API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints require the HTTP Header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user and issues a signed JWT token.
- **Request Body**:
```json
{
  "email": "admin@autocare.com",
  "password": "admin123"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "tokenType": "Bearer",
  "id": 1,
  "fullName": "System Administrator",
  "email": "admin@autocare.com",
  "role": "ROLE_ADMIN",
  "phone": "+91 98765 43210",
  "address": "Tech Park, HITEC City, Hyderabad"
}
```

### `POST /api/auth/register`
Registers a new customer account.
- **Request Body**:
```json
{
  "fullName": "Sainath Reddy",
  "email": "sainath@example.com",
  "password": "customer123",
  "phone": "+91 98765 33333",
  "address": "Miyapur, Hyderabad",
  "role": "ROLE_CUSTOMER"
}
```

---

## 2. Vehicles Management (`/api/vehicles`)

### `GET /api/vehicles`
- If Customer: returns list of vehicles owned by logged-in user.
- If Admin: returns all registered vehicles across the platform.

### `POST /api/vehicles`
Registers a new vehicle profile to the authenticated customer's garage.
- **Request Body**:
```json
{
  "registrationNumber": "TS09EA1234",
  "manufacturer": "Hyundai",
  "model": "Creta SX(O)",
  "manufacturingYear": 2022,
  "fuelType": "PETROL",
  "currentMileage": 34500,
  "vehicleCategory": "SUV",
  "lastServiceDate": "2026-05-15"
}
```

---

## 3. Service Requests & Workflow (`/api/service-requests`)

### `POST /api/service-requests`
Customer schedules a service booking.
- **Request Body**:
```json
{
  "vehicleId": 1,
  "serviceCategory": "General Servicing",
  "problemDescription": "Scheduled 35,000km periodic maintenance. Squeaking noise from front right brake on cold start.",
  "preferredDate": "2026-11-05"
}
```
- **Response `200 OK`**:
```json
{
  "id": 1,
  "bookingReference": "AP-2026-4821",
  "status": "BOOKED",
  "estimatedCost": 5500.00
}
```

### `PUT /api/service-requests/{id}/approve` (Admin only)
Approves booking and locks initial estimate.

### `POST /api/service-requests/{id}/assign` (Admin only)
Assigns a qualified mechanic to the approved order.
- **Request Body**:
```json
{
  "mechanicId": 1,
  "notes": "Inspect brake pad thickness and check rotor runout."
}
```

### `PUT /api/service-requests/{id}/status` (Mechanic & Admin)
Advances the milestone (`IN_PROGRESS`, `COMPLETED`, `DELIVERED`).
- **Request Body**:
```json
{
  "status": "COMPLETED",
  "notes": "Full synthetic oil flush completed, ceramic brake pads installed.",
  "partsReplaced": "SP-OIL-5W30, SP-BRK-PAD-F"
}
```

---

## 4. Invoices & Billing (`/api/invoices`)

### `POST /api/invoices` (Admin only)
Generates an itemized tax invoice with calculated 18% GST.
- **Request Body**:
```json
{
  "serviceRequestId": 1,
  "labourCharges": 2200.00,
  "sparePartsCharges": 4300.00,
  "gstRate": 18.00,
  "items": [
    { "itemType": "LABOUR", "description": "35,000 KM Periodic Service Labour", "quantity": 1, "unitPrice": 2200.00 },
    { "itemType": "PART", "description": "Synthec 5W-30 Full Synthetic Engine Oil (4L)", "quantity": 1, "unitPrice": 3200.00 },
    { "itemType": "PART", "description": "High Flow Premium Oil Filter", "quantity": 1, "unitPrice": 450.00 }
  ]
}
```

### `POST /api/invoices/{id}/pay`
Records payment receipt and updates invoice status to `PAID`.
- **Request Body**:
```json
{
  "paymentMethod": "UPI"
}
```

---

## 5. Spare Parts Inventory (`/api/inventory`)

### `GET /api/inventory`
Returns all stock SKUs with quantities, unit prices, and reorder levels.

### `POST /api/inventory/{id}/issue`
Deducts stock when parts are consumed on a vehicle repair order.

---

## 6. Admin Analytics (`/api/admin/analytics`)
Returns live database aggregates:
- `totalCustomers`, `totalVehicles`, `totalBookings`
- `pendingServices`, `activeRepairs`, `completedServices`
- `totalRevenue` (sum of paid invoices)
- `recentBookings` (last 5 active requests)
- `monthlyRevenue` (historical monthly revenue aggregation)
- `serviceCategories` (volume distribution breakdown)

---

## 7. AI Maintenance Recommendations (`/api/recommendations`)

### `GET /api/recommendations/my-vehicles`
Returns explainable preventative maintenance alerts for all vehicles in the authenticated customer's garage.
