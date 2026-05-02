# 🚀 Quick Start Guide - 24-Hour Hackathon Sprint

## What We're Building
A **High-Fidelity Hero Demo** of EthosEngine - an AI Integrity Sentinel dashboard powered by IBM technology.

## The 3 Core Components

### 1️⃣ AI Nutrition Label
Visual breakdown of:
- Data ingredients (training sources)
- Risk factors (bias indicators)
- Last audit timestamp

### 2️⃣ Trust Score Gauge
Animated circular gauge showing:
- 🔴 Red (0-40): High risk
- 🟡 Yellow (41-70): Medium risk  
- 🟢 Green (71-100): Low risk

### 3️⃣ Scan Button
Triggers IBM Granite Guardian analysis:
- User provides AI prompt/description
- Backend performs bias & safety scan
- Dashboard updates with real results

---

## Technology Stack

**Frontend** (Priority #1)
- Vite + React 18
- IBM Carbon Design System
- Mock data for immediate visuals

**Backend** (Priority #2)
- FastAPI (Python)
- IBM Granite Guardian model
- Single endpoint: `POST /api/scan`

---

## 24-Hour Timeline

| Hours | Phase | Deliverable |
|-------|-------|-------------|
| 0-4 | Frontend Foundation | Working dashboard with mock data |
| 4-8 | Backend Foundation | IBM Granite API integration |
| 8-12 | Integration & Polish | Connected demo with animations |
| 12-16 | Demo Scenarios | 3 realistic use cases |
| 16-20 | Testing & Refinement | Bug-free, stable demo |
| 20-24 | Documentation & Deploy | Production-ready package |

---

## First Steps (Hour 0-4)

```bash
# 1. Create Vite + React project
npm create vite@latest frontend -- --template react
cd frontend

# 2. Install IBM Carbon Design System
npm install @carbon/react @carbon/charts @carbon/charts-react

# 3. Create component structure
mkdir -p src/components src/services

# 4. Start development
npm run dev
```

---

## Success Criteria ✅

**Must-Have:**
- ✅ Professional IBM Carbon dashboard
- ✅ Animated trust score gauge
- ✅ AI Nutrition Label with data
- ✅ Working scan functionality
- ✅ IBM Granite integration
- ✅ Deployed and accessible

**Nice-to-Have:**
- Multiple demo scenarios
- Historical timeline
- PDF report download
- Dark mode

---

## Key Files to Create

### Frontend
- `frontend/src/App.jsx` - Main app
- `frontend/src/components/Dashboard.jsx` - Layout
- `frontend/src/components/NutritionLabel.jsx` - Data display
- `frontend/src/components/TrustScoreGauge.jsx` - Animated gauge
- `frontend/src/components/ScanButton.jsx` - Trigger button
- `frontend/src/services/api.js` - API client

### Backend
- `backend/main.py` - FastAPI app
- `backend/services/granite_service.py` - IBM integration
- `backend/utils/response_formatter.py` - JSON formatter

---

## Demo Talking Points

1. **Problem**: AI systems lack transparency
2. **Solution**: Real-time auditing with visual simplicity
3. **IBM Tech**: Granite Guardian + Carbon Design
4. **Impact**: EU AI Act compliance made easy

---

## Next Action

Ready to start **Hour 0-4: Frontend Foundation**?

Switch to **Code Mode** to begin implementation! 🚀