# 24-Hour IBM Hackathon Demo Plan
## EthosEngine - High-Fidelity Hero Demo

**Mission**: Build a professional, working demo that showcases AI Integrity Sentinel using IBM technology in 24 hours.

---

## 🎯 Core Philosophy

**"Demo-First, Scale Later"**
- Focus on visual impact and user experience
- Use mock data strategically to simulate full functionality
- One working feature is better than three half-finished ones
- IBM Carbon Design System for instant credibility

---

## 📊 Architecture Overview (Simplified)

```
┌─────────────────────────────────────────────────┐
│           React + Vite Frontend                 │
│        (IBM Carbon Design System)               │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ AI Nutrition │  │ Trust Score  │           │
│  │    Label     │  │    Gauge     │           │
│  └──────────────┘  └──────────────┘           │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │     Scan Button (Trigger)        │          │
│  └──────────────────────────────────┘          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         FastAPI Backend (Python)                │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │  IBM Granite Guardian Model      │          │
│  │  (Bias & Safety Scan)            │          │
│  └──────────────────────────────────┘          │
│                                                 │
│         Returns JSON Response                   │
└─────────────────────────────────────────────────┘
```

---

## ⏱️ 24-Hour Timeline

### **Hour 0-4: Frontend Foundation** ✅ PRIORITY #1
**Goal**: Professional-looking dashboard with mock data

#### Tasks:
1. **Setup Vite + React Project** (30 min)
   - Initialize Vite with React template
   - Install IBM Carbon Design System
   - Configure basic routing

2. **Create Dashboard Layout** (1 hour)
   - [`App.jsx`](frontend/src/App.jsx) - Main app component
   - [`Dashboard.jsx`](frontend/src/components/Dashboard.jsx) - Main dashboard layout
   - IBM Carbon header, sidebar navigation
   - Responsive grid layout

3. **AI Nutrition Label Component** (1.5 hours)
   - [`NutritionLabel.jsx`](frontend/src/components/NutritionLabel.jsx)
   - Display data ingredients (training data sources)
   - Show risk factors (bias indicators, safety concerns)
   - Use Carbon tiles and structured lists
   - Mock data structure:
     ```javascript
     {
       dataIngredients: ["Public datasets", "Proprietary data"],
       riskFactors: ["Demographic bias: 12%", "Safety score: 85%"],
       lastAudit: "2026-05-02"
     }
     ```

4. **Trust Score Gauge Component** (1 hour)
   - [`TrustScoreGauge.jsx`](frontend/src/components/TrustScoreGauge.jsx)
   - Animated circular gauge (Red/Yellow/Green)
   - Use Carbon progress indicators or custom D3.js
   - Smooth animation on component mount
   - Score ranges: 0-40 (Red), 41-70 (Yellow), 71-100 (Green)

5. **Scan Button & Loading State** (30 min)
   - [`ScanButton.jsx`](frontend/src/components/ScanButton.jsx)
   - IBM Carbon button with loading state
   - Trigger simulated API call
   - Show loading skeleton while "scanning"

**Deliverable**: Working frontend with mock data that looks production-ready

---

### **Hour 4-8: Backend Foundation** ✅ PRIORITY #2
**Goal**: Single FastAPI endpoint that returns realistic audit data

#### Tasks:
1. **Setup FastAPI Project** (30 min)
   - Initialize Python virtual environment
   - Install FastAPI, uvicorn, IBM watsonx SDK
   - Create basic project structure

2. **IBM Granite Guardian Integration** (2 hours)
   - [`main.py`](backend/main.py) - FastAPI app
   - [`granite_service.py`](backend/services/granite_service.py) - IBM model integration
   - Configure IBM watsonx.ai credentials
   - Implement single endpoint: `POST /api/scan`
   - Input: User prompt/model description
   - Process with Granite Guardian for bias & safety

3. **Response Formatter** (1 hour)
   - [`response_formatter.py`](backend/utils/response_formatter.py)
   - Transform Granite output to dashboard-friendly JSON
   - Structure:
     ```json
     {
       "trustScore": 78,
       "riskLevel": "yellow",
       "dataIngredients": [...],
       "riskFactors": [...],
       "biasAnalysis": {...},
       "safetyAnalysis": {...},
       "timestamp": "2026-05-02T07:52:41Z"
     }
     ```

4. **CORS & Error Handling** (30 min)
   - Enable CORS for frontend connection
   - Implement proper error responses
   - Add request validation

**Deliverable**: Working API endpoint that returns real IBM Granite analysis

---

### **Hour 8-12: Integration & Polish** ✅ PRIORITY #3
**Goal**: Connect frontend to backend, add animations and transitions

#### Tasks:
1. **API Integration** (1.5 hours)
   - [`api.js`](frontend/src/services/api.js) - API client
   - Connect scan button to backend endpoint
   - Handle loading states and errors
   - Update dashboard with real data

2. **Enhanced Animations** (1 hour)
   - Add smooth transitions between states
   - Animate trust score gauge on data update
   - Add pulse effect to scan button
   - Loading skeletons for all components

3. **Data Visualization** (1.5 hours)
   - Add charts for bias breakdown (Carbon Charts or Chart.js)
   - Visual timeline of audit history
   - Risk factor breakdown pie chart

4. **Error States & Edge Cases** (1 hour)
   - Empty state designs
   - Error message displays
   - Retry mechanisms
   - Input validation feedback

**Deliverable**: Fully integrated demo with smooth UX

---

### **Hour 12-16: Demo Scenarios & Content** ✅ PRIORITY #4
**Goal**: Prepare compelling demo scenarios with realistic data

#### Tasks:
1. **Create Demo Scenarios** (2 hours)
   - Scenario 1: HR Hiring AI (High bias detected)
   - Scenario 2: Financial Advisor AI (Low risk, high trust)
   - Scenario 3: Healthcare Chatbot (Medium risk, safety concerns)
   - Pre-populate with realistic audit results

2. **Demo Script & Walkthrough** (1 hour)
   - [`DEMO_SCRIPT.md`](Documentation/DEMO_SCRIPT.md)
   - Step-by-step presentation flow
   - Key talking points for each component
   - IBM technology callouts

3. **Branding & Visual Polish** (1 hour)
   - Add EthosEngine logo
   - Consistent color scheme (IBM Carbon theme)
   - Professional typography
   - Micro-interactions and hover states

**Deliverable**: Polished demo with compelling narratives

---

### **Hour 16-20: Testing & Refinement** ✅ PRIORITY #5
**Goal**: Ensure demo runs flawlessly

#### Tasks:
1. **End-to-End Testing** (2 hours)
   - Test all user flows
   - Verify API responses
   - Check responsive design (desktop/tablet)
   - Browser compatibility (Chrome, Firefox)

2. **Performance Optimization** (1 hour)
   - Optimize bundle size
   - Lazy load components
   - Cache API responses
   - Reduce animation jank

3. **Bug Fixes** (1 hour)
   - Fix any discovered issues
   - Smooth out rough edges
   - Verify error handling

**Deliverable**: Stable, bug-free demo

---

### **Hour 20-24: Documentation & Presentation** ✅ PRIORITY #6
**Goal**: Prepare for judges and create deployment-ready package

#### Tasks:
1. **README & Setup Instructions** (1 hour)
   - [`README.md`](README.md) - Updated with demo instructions
   - Quick start guide
   - Environment setup
   - Demo scenario descriptions

2. **Video Recording** (1.5 hours)
   - Record 3-minute demo walkthrough
   - Highlight IBM technology integration
   - Show key features and value proposition

3. **Deployment** (1 hour)
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to IBM Cloud or Render
   - Test production deployment

4. **Presentation Deck** (30 min)
   - 5-slide deck covering:
     - Problem statement
     - Solution overview
     - IBM technology usage
     - Demo walkthrough
     - Future roadmap

**Deliverable**: Complete demo package ready for judges

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Vite + React 18
- **UI Library**: IBM Carbon Design System
- **State Management**: React Context API (keep it simple)
- **Charts**: Carbon Charts or Chart.js
- **HTTP Client**: Axios
- **Animations**: Framer Motion (optional)

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **AI Model**: IBM Granite Guardian (via watsonx.ai)
- **Validation**: Pydantic
- **CORS**: fastapi-cors-middleware

### Deployment
- **Frontend**: Vercel or Netlify
- **Backend**: IBM Cloud Functions or Render
- **Environment**: Docker containers (optional)

---

## 📦 Project Structure

```
ethos-engine-demo/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NutritionLabel.jsx
│   │   │   ├── TrustScoreGauge.jsx
│   │   │   └── ScanButton.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── services/
│   │   └── granite_service.py
│   ├── utils/
│   │   └── response_formatter.py
│   ├── main.py
│   └── requirements.txt
├── Documentation/
│   ├── DEMO_SCRIPT.md
│   └── 24hr_hackathon_plan.md
└── README.md
```

---

## 🎨 Design Guidelines

### IBM Carbon Design System Usage
- Use Carbon components exclusively for consistency
- Stick to IBM Design Language color palette
- Follow Carbon spacing and typography scales
- Implement Carbon motion principles for animations

### Visual Hierarchy
1. **Trust Score Gauge** - Hero element, center stage
2. **AI Nutrition Label** - Secondary focus, detailed info
3. **Scan Button** - Clear call-to-action
4. **Supporting Charts** - Tertiary information

### Color Coding
- **Green (71-100)**: High trust, low risk
- **Yellow (41-70)**: Medium risk, needs attention
- **Red (0-40)**: High risk, critical issues

---

## 🚨 Risk Mitigation

### Technical Risks
1. **IBM API Rate Limits**
   - Solution: Implement response caching
   - Fallback: Use pre-generated responses for demo

2. **Deployment Issues**
   - Solution: Test deployment early (Hour 20)
   - Fallback: Run locally with ngrok for remote access

3. **Animation Performance**
   - Solution: Use CSS transforms, avoid layout thrashing
   - Fallback: Simplify animations if needed

### Time Management Risks
1. **Feature Creep**
   - Solution: Stick to core 3 components only
   - Rule: No new features after Hour 16

2. **Integration Delays**
   - Solution: Build frontend with mock data first
   - Fallback: Demo can work with mock data if needed

---

## ✅ Success Criteria

### Must-Have (Non-Negotiable)
- [ ] Professional-looking dashboard using IBM Carbon
- [ ] Animated trust score gauge (Red/Yellow/Green)
- [ ] AI Nutrition Label with realistic data
- [ ] Working scan button that triggers analysis
- [ ] IBM Granite Guardian integration
- [ ] Deployed and accessible via URL

### Nice-to-Have (If Time Permits)
- [ ] Multiple demo scenarios
- [ ] Historical audit timeline
- [ ] Downloadable PDF report
- [ ] Dark mode toggle
- [ ] Advanced data visualizations

---

## 🎯 Demo Talking Points

### For Judges
1. **Problem**: "AI systems lack transparency and accountability"
2. **Solution**: "EthosEngine provides instant AI auditing using IBM Granite"
3. **Innovation**: "Visual 'nutrition label' makes complex audits understandable"
4. **IBM Tech**: "Powered by IBM Granite Guardian and Carbon Design System"
5. **Impact**: "Helps companies meet EU AI Act compliance requirements"

### Key Differentiators
- Real-time auditing (not post-deployment)
- Visual simplicity (CEO-friendly dashboard)
- IBM enterprise-grade technology
- Regulatory compliance built-in

---

## 📝 Next Steps (Post-Hackathon)

If the demo wins or gets traction:
1. Implement full multi-agent orchestration
2. Add database for audit history
3. Build user authentication system
4. Create API documentation
5. Develop pricing model
6. Pursue IBM partnership opportunities

---

## 🚀 Let's Build!

**Current Status**: Ready to start Hour 0-4 (Frontend Foundation)

**First Command**: Create Vite + React project with IBM Carbon Design System

**Remember**: 
- Focus on visual impact
- One feature at a time
- Test early and often
- Keep it simple and working

---

*Generated: 2026-05-02*
*Target: IBM Hackathon Demo*
*Timeline: 24 Hours*