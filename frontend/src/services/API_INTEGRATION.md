# API Integration Documentation

## Overview

This document describes the complete API integration between the EthosEngine frontend and backend, implemented as part of **Priority 3, Task 1** of the 24-hour hackathon plan.

## Architecture

```
┌─────────────────────────────────────────────────┐
│           React Frontend (Vite)                 │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │   ScanButton Component           │          │
│  │   - User Input Collection        │          │
│  │   - API Call Trigger             │          │
│  └──────────────────────────────────┘          │
│                   ↓                             │
│  ┌──────────────────────────────────┐          │
│  │   API Service (api.js)           │          │
│  │   - Axios Client                 │          │
│  │   - Request/Response Handling    │          │
│  │   - Error Management             │          │
│  │   - Retry Logic                  │          │
│  └──────────────────────────────────┘          │
│                   ↓                             │
└─────────────────────────────────────────────────┘
                    ↓ HTTP POST
┌─────────────────────────────────────────────────┐
│         FastAPI Backend (Python)                │
│                                                 │
│  POST /api/scan                                 │
│  ┌──────────────────────────────────┐          │
│  │   IBM Granite Guardian           │          │
│  │   - Bias Detection               │          │
│  │   - Safety Analysis              │          │
│  └──────────────────────────────────┘          │
│                   ↓                             │
│  ┌──────────────────────────────────┐          │
│  │   Response Formatter             │          │
│  │   - Trust Score Calculation      │          │
│  │   - Risk Level Determination     │          │
│  └──────────────────────────────────┘          │
│                   ↓                             │
└─────────────────────────────────────────────────┘
                    ↓ JSON Response
┌─────────────────────────────────────────────────┐
│           React Frontend (Vite)                 │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │   Dashboard Component            │          │
│  │   - Trust Score Display          │          │
│  │   - Statistics Update            │          │
│  └──────────────────────────────────┘          │
│                   ↓                             │
│  ┌──────────────────────────────────┐          │
│  │   NutritionLabel Component       │          │
│  │   - Detailed Results Display     │          │
│  │   - Risk Factors Breakdown       │          │
│  └──────────────────────────────────┘          │
└─────────────────────────────────────────────────┘
```

## Components

### 1. API Service (`frontend/src/services/api.js`)

**Purpose**: Centralized API client for all backend communication.

**Features**:
- Axios-based HTTP client with configurable base URL
- Request/response interceptors for logging and error handling
- Automatic retry logic for network failures (up to 3 retries)
- 30-second timeout for requests
- Comprehensive error formatting

**Key Methods**:

```javascript
// Health check
await apiService.healthCheck()

// Scan content
await apiService.scanContent({
  content: "Model description...",
  scanType: "comprehensive" // or "safety_only", "bias_only"
})

// Get API info
await apiService.getApiInfo()
```

**Configuration**:
- Base URL: `VITE_API_BASE_URL` environment variable (default: `http://localhost:8000`)
- Timeout: 30 seconds
- Max retries: 3 attempts with exponential backoff

### 2. ScanButton Component (`frontend/src/components/ScanButton.jsx`)

**Updates**:
- Integrated real API calls via `apiService.scanContent()`
- Added error state management with user-friendly error messages
- Implemented fallback to mock data mode if API is unavailable
- Added retry and demo mode buttons for error recovery
- Progressive loading states with descriptive messages

**API Integration Flow**:
1. User enters model name and description in modal
2. Component builds content string from input
3. Calls `apiService.scanContent()` with content
4. Displays progressive loading states
5. Transforms API response to component format
6. Passes results to parent Dashboard component
7. Handles errors gracefully with retry options

**Error Handling**:
- Network errors: Offers retry with real API or switch to demo mode
- Validation errors: Displays specific field errors
- Server errors: Shows error message with retry option
- Timeout errors: Automatic retry with exponential backoff

### 3. Dashboard Component (`frontend/src/components/Dashboard.jsx`)

**Updates**:
- Added `scanResults` state to store full API response
- Enhanced `handleScanComplete()` to handle both success and error cases
- Passes scan results to child components (NutritionLabel)
- Updates statistics based on real scan data

**Data Flow**:
```javascript
ScanButton → handleScanComplete(results) → {
  - Update trustScoreData (for TrustScoreGauge)
  - Store scanResults (for NutritionLabel)
  - Update auditStats (for statistics display)
}
```

### 4. NutritionLabel Component (`frontend/src/components/NutritionLabel.jsx`)

**Updates**:
- Accepts `scanResults` prop from Dashboard
- Transforms API response to nutrition label format
- Displays real bias and safety analysis data
- Falls back to mock data when no scan results available

**Data Transformation**:
```javascript
API Response → transformScanResults() → {
  dataIngredients: [...],
  riskFactors: [
    { type, value, level },
    ...
  ],
  lastAudit: timestamp,
  modelVersion: modelName,
  trainingDate: timestamp
}
```

## API Request/Response Format

### Request: POST /api/scan

```json
{
  "content": "Model: HR Hiring Assistant v2.1\nDescription: AI model for screening job applications",
  "scan_type": "comprehensive"
}
```

**Parameters**:
- `content` (required): Text content to scan (1-10,000 characters)
- `scan_type` (optional): Type of scan - "comprehensive", "safety_only", or "bias_only"

### Response: Success (200 OK)

```json
{
  "success": true,
  "message": "Content scanned successfully using IBM Granite Guardian",
  "data": {
    "trustScore": 78,
    "riskLevel": "yellow",
    "dataIngredients": [
      "IBM Granite Guardian HAP Model",
      "IBM Granite Guardian Bias Detection Model",
      "Comprehensive multi-model analysis"
    ],
    "riskFactors": [
      "Safety risk score: 15/100",
      "Bias score: 25/100",
      "Bias types: demographic, gender"
    ],
    "biasAnalysis": {
      "score": 25,
      "types": ["demographic", "gender"],
      "details": "Detected potential demographic bias...",
      "recommendations": ["Review training data diversity", "..."]
    },
    "safetyAnalysis": {
      "score": 15,
      "riskLevel": "low",
      "categoriesDetected": [],
      "details": "No significant safety concerns detected"
    },
    "timestamp": "2026-05-02T14:52:41Z",
    "scanType": "comprehensive",
    "contentLength": 85,
    "modelVersions": {
      "hap": "granite-guardian-hap-38m",
      "bias": "granite-guardian-bias-detection"
    }
  }
}
```

### Response: Error (4xx/5xx)

```json
{
  "success": false,
  "error": {
    "type": "validation_error",
    "message": "Request validation failed",
    "details": [
      {
        "field": "content",
        "message": "Content cannot be empty or only whitespace",
        "type": "value_error"
      }
    ],
    "timestamp": "2026-05-02T14:52:41Z"
  }
}
```

## Environment Configuration

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Development Settings
VITE_DEBUG_MODE=true

# Feature Flags
VITE_USE_MOCK_DATA=false
```

### Backend (.env)

```env
# IBM watsonx.ai Configuration
IBM_WATSONX_API_KEY=your_api_key_here
IBM_WATSONX_PROJECT_ID=your_project_id_here
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Error Handling Strategy

### 1. Network Errors
- **Symptom**: No response from server
- **Handling**: Automatic retry (up to 3 attempts with exponential backoff)
- **User Action**: "Retry" or "Use Demo Mode" buttons

### 2. Validation Errors
- **Symptom**: 422 Unprocessable Entity
- **Handling**: Display specific field errors
- **User Action**: Fix input and retry

### 3. Server Errors
- **Symptom**: 500 Internal Server Error
- **Handling**: Display generic error message
- **User Action**: "Retry" button

### 4. Timeout Errors
- **Symptom**: Request exceeds 30 seconds
- **Handling**: Automatic retry with backoff
- **User Action**: "Retry" or "Use Demo Mode" buttons

### 5. CORS Errors
- **Symptom**: Browser blocks request
- **Handling**: Backend CORS middleware configured
- **User Action**: Ensure backend is running with correct CORS settings

## Testing

### Manual Testing Steps

1. **Start Backend**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Scenarios**:
   - ✅ Successful scan with valid input
   - ✅ Error handling with empty input
   - ✅ Network error (backend stopped)
   - ✅ Timeout handling (slow network)
   - ✅ Demo mode fallback

### API Testing with curl

```bash
# Health check
curl http://localhost:8000/health

# Scan content
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test AI model for hiring",
    "scan_type": "comprehensive"
  }'
```

## Performance Considerations

1. **Request Timeout**: 30 seconds to accommodate IBM Granite processing
2. **Retry Logic**: Exponential backoff (1s, 2s, 3s) to avoid overwhelming server
3. **Response Caching**: Not implemented (real-time analysis required)
4. **Loading States**: Progressive messages to keep user informed

## Security Considerations

1. **API Key Protection**: Backend API keys stored in environment variables
2. **CORS Configuration**: Restricted to specific origins
3. **Input Validation**: Both frontend and backend validation
4. **Error Messages**: Generic messages to avoid exposing internal details

## Future Enhancements

1. **Authentication**: Add JWT token support for user authentication
2. **Rate Limiting**: Implement request throttling on frontend
3. **Caching**: Cache recent scan results for identical content
4. **WebSocket**: Real-time progress updates for long-running scans
5. **Batch Scanning**: Support multiple model scans in one request
6. **Export Results**: Download scan results as PDF/JSON

## Troubleshooting

### Issue: "Unable to connect to server"
**Solution**: 
1. Verify backend is running on port 8000
2. Check `VITE_API_BASE_URL` in frontend/.env
3. Ensure no firewall blocking localhost:8000

### Issue: "CORS error in browser console"
**Solution**:
1. Verify backend CORS_ORIGINS includes frontend URL
2. Restart backend after changing CORS settings
3. Clear browser cache

### Issue: "Request timeout"
**Solution**:
1. Check IBM watsonx.ai credentials in backend/.env
2. Verify network connectivity to IBM services
3. Increase timeout in api.js if needed

### Issue: "Validation error"
**Solution**:
1. Check content length (1-10,000 characters)
2. Ensure content is not empty or whitespace only
3. Verify scan_type is valid value

## Completion Status

✅ **Task 1: API Integration (Priority 3)** - COMPLETE

**Deliverables**:
- ✅ API service with Axios configuration
- ✅ Request/response interceptors
- ✅ Error handling and retry logic
- ✅ ScanButton integration with real API
- ✅ Dashboard updates for API responses
- ✅ NutritionLabel data transformation
- ✅ Environment variable configuration
- ✅ Comprehensive documentation

**Time Estimate**: 1.5 hours (as per hackathon plan)
**Actual Time**: Completed within estimated timeframe

---

*Generated: 2026-05-02*
*Part of: EthosEngine 24-Hour IBM Hackathon Demo*
*Priority: #3, Task: #1*