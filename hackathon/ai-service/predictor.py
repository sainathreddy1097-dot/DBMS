"""
AutoCare Pro - AI Maintenance Prediction Engine
CodeSpark Hackathon 2026 - Problem Statement 05

This module implements an explainable automotive wear prediction model.
It evaluates:
- current_mileage (km)
- previous_service_mileage (km)
- vehicle_age_years
- months_since_last_service
- vehicle_category
"""

import json
from datetime import datetime

class VehicleMaintenancePredictor:
    def __init__(self):
        # Service wear threshold guidelines based on automotive engineering standards
        self.rules = {
            "oil_change": {
                "max_km": 10000,
                "max_months": 6,
                "base_cost": 3200.0,
                "title": "Engine Oil & Filter Renewal Due",
                "category": "Oil Change"
            },
            "general_service": {
                "max_km": 12000,
                "max_months": 10,
                "base_cost": 5500.0,
                "title": "Annual Comprehensive Periodic Maintenance",
                "category": "General Servicing"
            },
            "brake_inspection": {
                "max_km": 15000,
                "wear_mileage_cycle": 30000,
                "base_cost": 3800.0,
                "title": "Brake Friction Material & Disc Runout Audit",
                "category": "Brake Inspection"
            },
            "tyre_inspection": {
                "max_km": 40000,
                "max_age_years": 4,
                "base_cost": 1800.0,
                "title": "Tyre Tread Depth & Laser Wheel Alignment",
                "category": "Wheel Alignment"
            },
            "battery_check": {
                "max_age_years": 3,
                "base_cost": 6000.0,
                "title": "12V Starter Battery Cold-Cranking Diagnostic",
                "category": "Battery Replacement"
            }
        }

    def predict(self, telemetry: dict) -> list:
        current_mileage = telemetry.get("current_mileage", 0)
        previous_service_mileage = telemetry.get("previous_service_mileage", max(0, current_mileage - 8000))
        vehicle_age_years = telemetry.get("vehicle_age_years", 3)
        months_since_last_service = telemetry.get("months_since_last_service", 6)

        km_since_last = max(0, current_mileage - previous_service_mileage)
        recommendations = []

        # 1. Engine Oil Change Check
        oil_rule = self.rules["oil_change"]
        if km_since_last >= 9000 or months_since_last_service >= 6:
            urgency = "HIGH" if (km_since_last >= 10000 or months_since_last_service >= 9) else "MEDIUM"
            recommendations.append({
                "title": oil_rule["title"],
                "urgency": urgency,
                "category": oil_rule["category"],
                "estimated_cost": oil_rule["base_cost"],
                "trigger_factor": f"{km_since_last} km & {months_since_last_service} months since renewal",
                "explanation": f"Synthetic multi-grade motor oil undergoes thermal breakdown after 10,000 km or 6 months. Current distance: {km_since_last} km."
            })

        # 2. General Servicing Check
        gen_rule = self.rules["general_service"]
        if km_since_last >= 10000 or months_since_last_service >= 10:
            recommendations.append({
                "title": gen_rule["title"],
                "urgency": "HIGH",
                "category": gen_rule["category"],
                "estimated_cost": gen_rule["base_cost"],
                "trigger_factor": f"{months_since_last_service} months elapsed without full multi-point audit",
                "explanation": "Annual full-system vehicle diagnostics recommended for fluid integrity, brake cables, and chassis bush health."
            })

        # 3. Brake Inspection Check
        brake_rule = self.rules["brake_inspection"]
        if current_mileage >= 25000 and (current_mileage % 15000 <= 3000 or km_since_last >= 12000):
            recommendations.append({
                "title": brake_rule["title"],
                "urgency": "MEDIUM",
                "category": brake_rule["category"],
                "estimated_cost": brake_rule["base_cost"],
                "trigger_factor": f"Odometer reached {current_mileage} km wear lifecycle",
                "explanation": "Front ceramic pads experience 60-70% friction material wear at this odometer mark. Thickness and disc runout check advised."
            })

        # 4. Tyre & Wheel Alignment Check
        tyre_rule = self.rules["tyre_inspection"]
        if current_mileage >= 35000 or vehicle_age_years >= 4:
            recommendations.append({
                "title": tyre_rule["title"],
                "urgency": "HIGH" if current_mileage >= 45000 else "MEDIUM",
                "category": tyre_rule["category"],
                "estimated_cost": tyre_rule["base_cost"],
                "trigger_factor": f"Age ({vehicle_age_years} yrs) & total distance ({current_mileage} km)",
                "explanation": "Radial tyres develop shoulder wear and compound hardening past 40,000 km or 4 years of operational UV exposure."
            })

        # 5. Battery Health Check
        bat_rule = self.rules["battery_check"]
        if vehicle_age_years >= 3:
            recommendations.append({
                "title": bat_rule["title"],
                "urgency": "MEDIUM",
                "category": bat_rule["category"],
                "estimated_cost": bat_rule["base_cost"],
                "trigger_factor": f"Vehicle age is {vehicle_age_years} years",
                "explanation": "Lead-acid and AGM starter batteries lose electrolyte active mass after 3 years in ambient temperatures."
            })

        return recommendations


if __name__ == "__main__":
    predictor = VehicleMaintenancePredictor()
    sample_vehicle = {
        "current_mileage": 34500,
        "previous_service_mileage": 25000,
        "vehicle_age_years": 3,
        "months_since_last_service": 8,
        "category": "SUV"
    }
    recs = predictor.predict(sample_vehicle)
    print(f"--- AutoCare Pro AI Predictions for Sample Vehicle ---")
    print(json.dumps(recs, indent=2))
