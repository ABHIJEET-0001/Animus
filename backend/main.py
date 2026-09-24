from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import List, Optional
import datetime
import random

app = FastAPI(title="EcoWild AI Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for realistic dynamic state
CAMERAS_DB = [
    {
        "id": "CAM-01",
        "location": "NH-44 Corridor Mile 42",
        "zone": "Zone 1 - River Crossing",
        "status": "Online",
        "detections": 28,
        "risk_level": "LOW",
        "fps": 30,
        "battery": 96,
        "temp": "31°C",
        "night_vision": True,
        "sensitivity": 88,
        "coordinates": {"lat": 21.1458, "lng": 79.0882}
    },
    {
        "id": "CAM-02",
        "location": "NH-44 Forest Buffer KM 58",
        "zone": "Zone 2 - Dense Canopy",
        "status": "Online",
        "detections": 64,
        "risk_level": "MEDIUM",
        "fps": 30,
        "battery": 89,
        "temp": "34°C",
        "night_vision": True,
        "sensitivity": 92,
        "coordinates": {"lat": 21.1685, "lng": 79.1120}
    },
    {
        "id": "CAM-03",
        "location": "NH-44 Underpass Approach KM 74",
        "zone": "Zone 3 - Underpass Ramp",
        "status": "Online",
        "detections": 15,
        "risk_level": "LOW",
        "fps": 30,
        "battery": 98,
        "temp": "29°C",
        "night_vision": False,
        "sensitivity": 85,
        "coordinates": {"lat": 21.1920, "lng": 79.1415}
    },
    {
        "id": "CAM-04",
        "location": "NH-44 Critical Gap KM 89",
        "zone": "Zone 4 - Elephant Migration Path",
        "status": "Online",
        "detections": 142,
        "risk_level": "HIGH",
        "fps": 28,
        "battery": 82,
        "temp": "36°C",
        "night_vision": True,
        "sensitivity": 95,
        "coordinates": {"lat": 21.2210, "lng": 79.1750}
    },
    {
        "id": "CAM-05",
        "location": "NH-44 Hillock Curve KM 97",
        "zone": "Zone 5 - Blind Curve S-Bend",
        "status": "Online",
        "detections": 53,
        "risk_level": "MEDIUM",
        "fps": 30,
        "battery": 91,
        "temp": "32°C",
        "night_vision": True,
        "sensitivity": 90,
        "coordinates": {"lat": 21.2460, "lng": 79.2010}
    },
    {
        "id": "CAM-06",
        "location": "NH-44 Open Grassland KM 112",
        "zone": "Zone 6 - Deer Grazing Plains",
        "status": "Online",
        "detections": 79,
        "risk_level": "HIGH",
        "fps": 29,
        "battery": 87,
        "temp": "33°C",
        "night_vision": True,
        "sensitivity": 94,
        "coordinates": {"lat": 21.2780, "lng": 79.2340}
    }
]

DETECTIONS_LOG = [
    {
        "id": "DET-8491",
        "cam_id": "CAM-04",
        "zone": "Zone 4 - Elephant Migration Path",
        "animal": "Asian Elephant",
        "confidence": 0.96,
        "distance_m": 14.5,
        "vehicle_speed_kmh": 78,
        "risk_level": "HIGH",
        "timestamp": "20:34:10",
        "action_taken": "VMS Signboard Activated & High-Beam Acoustic Chirp",
        "bbox": [140, 180, 310, 290]
    },
    {
        "id": "DET-8490",
        "cam_id": "CAM-02",
        "zone": "Zone 2 - Dense Canopy",
        "animal": "Spotted Deer (Chital)",
        "confidence": 0.93,
        "distance_m": 22.0,
        "vehicle_speed_kmh": 65,
        "risk_level": "MEDIUM",
        "timestamp": "20:28:45",
        "action_taken": "Driver In-Cab HUD Warning Pushed",
        "bbox": [320, 210, 120, 150]
    },
    {
        "id": "DET-8489",
        "cam_id": "CAM-06",
        "zone": "Zone 6 - Deer Grazing Plains",
        "animal": "Wild Boar Family",
        "confidence": 0.89,
        "distance_m": 8.0,
        "vehicle_speed_kmh": 85,
        "risk_level": "HIGH",
        "timestamp": "20:19:22",
        "action_taken": "Speed Limit Reduced to 40 km/h on Sector 6",
        "bbox": [200, 260, 190, 120]
    },
    {
        "id": "DET-8488",
        "cam_id": "CAM-01",
        "zone": "Zone 1 - River Crossing",
        "animal": "Nilgai (Blue Bull)",
        "confidence": 0.91,
        "distance_m": 42.0,
        "vehicle_speed_kmh": 55,
        "risk_level": "LOW",
        "timestamp": "19:54:11",
        "action_taken": "Passive Telemetry Logged",
        "bbox": [410, 190, 160, 180]
    },
    {
        "id": "DET-8487",
        "cam_id": "CAM-05",
        "zone": "Zone 5 - Blind Curve S-Bend",
        "animal": "Leopard",
        "confidence": 0.94,
        "distance_m": 16.2,
        "vehicle_speed_kmh": 72,
        "risk_level": "HIGH",
        "timestamp": "19:35:04",
        "action_taken": "Emergency Patrol Notified & Flashing Amber Beacon",
        "bbox": [180, 240, 150, 110]
    }
]

ACTIVE_ALERTS = [
    {
        "id": "ALT-104",
        "cam_id": "CAM-04",
        "animal": "Asian Elephant",
        "location": "KM 89 - Sector 4",
        "distance_m": 14.5,
        "time_to_collision_sec": 3.8,
        "urgency": "CRITICAL",
        "recommended_speed": 35,
        "signage_message": "CAUTION: ELEPHANT CROSSING AT KM 89 — SLOW TO 35 KM/H",
        "timestamp": "20:34:10"
    }
]

DRIVER_RESPONSES = [
    {"vehicle_id": "KA-01-MJ-8821", "status": "Slowed Down", "time": "20:34:18", "speed_reduction": "82 -> 38 km/h"},
    {"vehicle_id": "MH-12-PQ-4019", "status": "Hazard Lights On", "time": "20:34:22", "speed_reduction": "74 -> 35 km/h"},
]

class CameraUpdate(BaseModel):
    night_vision: Optional[bool] = None
    sensitivity: Optional[int] = None
    status: Optional[str] = None

class SimulationRequest(BaseModel):
    animal: str
    cam_id: str
    risk_level: str
    distance_m: float
    vehicle_speed_kmh: float

class DriverFeedbackRequest(BaseModel):
    vehicle_id: str
    action: str
    current_speed: float

@app.get("/")
def read_root():
    return {
        "system": "EcoWild AI Smart Highway Command API",
        "status": "Operational",
        "active_cameras": len(CAMERAS_DB),
        "monitoring_active": True,
        "version": "2.0.0"
    }

@app.get("/cameras")
def get_cameras():
    return CAMERAS_DB

@app.patch("/cameras/{cam_id}")
def update_camera(cam_id: str, update: CameraUpdate):
    for cam in CAMERAS_DB:
        if cam["id"] == cam_id:
            if update.night_vision is not None:
                cam["night_vision"] = update.night_vision
            if update.sensitivity is not None:
                cam["sensitivity"] = update.sensitivity
            if update.status is not None:
                cam["status"] = update.status
            return {"success": True, "camera": cam}
    raise HTTPException(status_code=404, detail="Camera not found")

@app.get("/detections")
def get_detections():
    return DETECTIONS_LOG

@app.post("/detections/simulate")
def simulate_detection(req: SimulationRequest):
    new_det = {
        "id": f"DET-{random.randint(8500, 9999)}",
        "cam_id": req.cam_id,
        "zone": next((c["zone"] for c in CAMERAS_DB if c["id"] == req.cam_id), "Unknown Zone"),
        "animal": req.animal,
        "confidence": round(random.uniform(0.88, 0.98), 2),
        "distance_m": req.distance_m,
        "vehicle_speed_kmh": req.vehicle_speed_kmh,
        "risk_level": req.risk_level,
        "timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
        "action_taken": "VMS Emergency Advisory & Driver Audio Alert Triggered",
        "bbox": [random.randint(120, 260), random.randint(140, 240), random.randint(140, 260), random.randint(120, 220)]
    }
    DETECTIONS_LOG.insert(0, new_det)
    if len(DETECTIONS_LOG) > 50:
        DETECTIONS_LOG.pop()

    # Update camera detections count and risk level
    for cam in CAMERAS_DB:
        if cam["id"] == req.cam_id:
            cam["detections"] += 1
            cam["risk_level"] = req.risk_level

    # Push active alert if risk is HIGH or MEDIUM
    if req.risk_level in ["HIGH", "CRITICAL", "MEDIUM"]:
        alt = {
            "id": f"ALT-{random.randint(105, 999)}",
            "cam_id": req.cam_id,
            "animal": req.animal,
            "location": f"{cam['location']} ({cam['zone']})",
            "distance_m": req.distance_m,
            "time_to_collision_sec": round(req.distance_m / max(req.vehicle_speed_kmh * 0.277, 1), 1),
            "urgency": "CRITICAL" if req.risk_level in ["HIGH", "CRITICAL"] else "WARNING",
            "recommended_speed": 35 if req.risk_level in ["HIGH", "CRITICAL"] else 50,
            "signage_message": f"WILDLIFE ALERT: {req.animal.upper()} DETECTED NEAR ROADWAY — SLOW DOWN IMMEDIATELY",
            "timestamp": new_det["timestamp"]
        }
        ACTIVE_ALERTS.insert(0, alt)
        if len(ACTIVE_ALERTS) > 10:
            ACTIVE_ALERTS.pop()

    return {"success": True, "detection": new_det}

@app.get("/alerts")
def get_alerts():
    return ACTIVE_ALERTS

@app.delete("/alerts/{alert_id}")
def dismiss_alert(alert_id: str):
    global ACTIVE_ALERTS
    ACTIVE_ALERTS = [a for a in ACTIVE_ALERTS if a["id"] != alert_id]
    return {"success": True, "message": f"Alert {alert_id} cleared"}

@app.get("/analytics")
def get_analytics():
    return {
        "stats": {
            "wildlife_events_today": 342,
            "drivers_alerted": 2490,
            "high_risk_prevented": 54,
            "avg_alert_latency_ms": 320,
            "animal_mortality_reduction_pct": 89.4,
            "economic_damage_averted_inr": "₹ 1.48 Crore",
            "fuel_saved_liters": 3840,
            "co2_reduction_kg": 8830
        },
        "species_breakdown": [
            {"name": "Spotted Deer", "value": 44, "color": "#10b981"},
            {"name": "Asian Elephant", "value": 18, "color": "#f59e0b"},
            {"name": "Wild Boar", "value": 22, "color": "#06b6d4"},
            {"name": "Leopard / Big Cat", "value": 6, "color": "#ef4444"},
            {"name": "Nilgai / Cattle", "value": 10, "color": "#8b5cf6"}
        ],
        "hourly_activity": [
            {"hour": "00:00", "detections": 38, "riskEvents": 14},
            {"hour": "03:00", "detections": 45, "riskEvents": 18},
            {"hour": "06:00", "detections": 29, "riskEvents": 8},
            {"hour": "09:00", "detections": 12, "riskEvents": 2},
            {"hour": "12:00", "detections": 8, "riskEvents": 1},
            {"hour": "15:00", "detections": 14, "riskEvents": 4},
            {"hour": "18:00", "detections": 52, "riskEvents": 22},
            {"hour": "21:00", "detections": 68, "riskEvents": 31},
        ],
        "monthly_accidents_comparison": [
            {"month": "May", "without_ai": 19, "with_ai": 3},
            {"month": "Jun", "without_ai": 22, "with_ai": 2},
            {"month": "Jul", "without_ai": 31, "with_ai": 4},
            {"month": "Aug", "without_ai": 28, "with_ai": 3},
            {"month": "Sep", "without_ai": 26, "with_ai": 1}
        ]
    }

@app.post("/driver-feedback")
def submit_driver_feedback(req: DriverFeedbackRequest):
    entry = {
        "vehicle_id": req.vehicle_id,
        "status": req.action,
        "time": datetime.datetime.now().strftime("%H:%M:%S"),
        "speed_reduction": f"{req.current_speed} -> 35 km/h"
    }
    DRIVER_RESPONSES.insert(0, entry)
    if len(DRIVER_RESPONSES) > 20:
        DRIVER_RESPONSES.pop()
    return {"success": True, "log": entry}

@app.get("/driver-responses")
def get_driver_responses():
    return DRIVER_RESPONSES

@app.get("/export-csv")
def export_csv():
    csv_lines = ["Detection_ID,Camera_ID,Zone,Animal,Confidence,Distance_M,Speed_KMH,Risk_Level,Timestamp,Action"]
    for d in DETECTIONS_LOG:
        csv_lines.append(f"{d['id']},{d['cam_id']},{d['zone']},{d['animal']},{d['confidence']},{d['distance_m']},{d['vehicle_speed_kmh']},{d['risk_level']},{d['timestamp']},\"{d['action_taken']}\"")
    return PlainTextResponse(content="\n".join(csv_lines), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=ecowild_incident_report.csv"})
