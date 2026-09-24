# EcoWild AI — AI-Powered Wildlife-Safe Smart Highway 🦌🛣️

**EcoWild AI** is a complete, hackathon-ready highway safety and environmental monitoring platform designed to detect animals near highways, assess collision risk, generate real-time alerts, and analyze historical data to identify wildlife risk zones.

Built for the **EcoLogic 1.0 by Mercer | Mettl** hackathon, this project focuses on **Mobility, environmental protection, AI, measurable impact, and practical real-world technology**.

## 🚀 Features

The system follows a complete lifecycle:
**Detect → Analyze → Alert → Record → Predict Risk → Measure Impact**

- 🎥 **Live CCTV Monitoring:** Real-time dashboard to monitor highway feeds. Includes a built-in simulation engine (Demo Mode) to showcase the functionality without requiring a real camera feed.
- 🧠 **AI Animal Detection:** Architecture ready to integrate with YOLO + OpenCV backend to detect animals like deer, cows, dogs, elephants, and wild boars.
- ⚠️ **Wildlife Risk Engine:** Advanced risk scoring (🟢 Low, 🟡 Medium, 🔴 High) based on animal distance, vehicle proximity, and time of day.
- 📱 **Real-Time Driver Alerts:** Mobile-friendly driver interface simulating wildlife alerts for oncoming vehicles.
- 🗺️ **Wildlife Risk Map:** Interactive heatmaps highlighting repeated detection hotspots to aid highway authorities in adding preventive measures.
- 📊 **Analytics & Impact Dashboard:** Tracks metrics such as vehicles alerted, high-risk events prevented, estimated fuel saved, and CO₂ impact.
- 💡 **AI Insights:** Automatically generates actionable insights and recommendations based on detection trends.

## 🏗️ System Architecture

1. **CCTV Cameras / Video Feeds**
2. **Edge Processing (Raspberry Pi/Edge Device)**
3. **YOLO Animal Detection (AI Model)**
4. **Risk Assessment Engine (FastAPI Backend)**
5. **Real-time Alert Service & Database (WebSockets / Firebase)**
6. **Analytics + Risk Map (React Frontend)**
7. **Highway Authority Control Center / Driver Alert UI**

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend:** Python, FastAPI
- **AI Model (Integration Ready):** YOLO, OpenCV
- **Database (Optional/Future):** Firebase / Supabase
- **Mapping:** SVG-based simulated maps (or Google Maps API)

## 🚦 Getting Started

### 1. Frontend Setup (React/Vite)

Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

### 2. Backend Setup (FastAPI)

Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment and install dependencies (make sure `fastapi` and `uvicorn` are installed):
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate
pip install fastapi uvicorn
```

Start the backend server:
```bash
uvicorn main:app --reload
```

## 🎮 Demo Mode

Since a live YOLO AI model requires heavy hardware, the frontend comes equipped with a **Demo Simulation Engine**.
Click the **"START LIVE MONITORING"** or **"START DEMO"** button on the dashboard to automatically simulate CCTV events, realistic AI detections, risk score calculations, and driver alerts.

## 🌱 Environmental Impact & Sustainability

This project demonstrates how smart technology can go beyond simple monitoring:
- **MONITOR:** Track wildlife corridors using existing highway CCTV infrastructure.
- **PREDICT:** Identify recurring hotspots and seasonal movement patterns.
- **ALERT:** Save lives (both animal and human) through real-time notifications to drivers.
- **OPTIMIZE:** Reduce sudden braking incidents, thereby lowering unnecessary fuel consumption and CO₂ emissions.
- **MEASURE:** Provide actionable data to authorities for installing physical wildlife crossings or fencing in data-proven high-risk zones.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Copyright (c) 2026 EcoWild AI.
