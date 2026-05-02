# IBM Granite Guardian Integration - Implementation Guide

## Overview

This implementation integrates IBM Granite Guardian models for AI content integrity analysis, focusing on bias detection and safety scanning.

## Architecture

### Components

1. **main.py** - FastAPI application with `/api/scan` endpoint
2. **granite_service.py** - IBM Granite Guardian integration
3. **response_formatter.py** - Response transformation for frontend

### IBM Granite Guardian Models Used

- **ibm/granite-guardian-hap-38m** - Hate, Abuse, Profanity detection
- **ibm/granite-guardian-3-8b** - Bias detection (demographic, gender, racial, cultural)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure IBM watsonx.ai Credentials

Edit `backend/.env` file:

```env
IBM_WATSONX_API_KEY=your_actual_api_key
IBM_WATSONX_PROJECT_ID=your_actual_project_id
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**Getting Credentials:**
1. Go to [IBM Cloud](https://cloud.ibm.com/)
2. Create a watsonx.ai instance
3. Get your API key from IAM settings
4. Get your Project ID from watsonx.ai project settings

### 3. Run the Server

```bash
cd backend
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoint

### POST /api/scan

Scans user prompts or model descriptions for bias and safety issues.

**Request:**
```json
{
  "content": "Your AI prompt or model description here",
  "scan_type": "comprehensive"
}
```

**Scan Types:**
- `comprehensive` - Full bias and safety analysis (default)
- `safety_only` - Only safety/HAP analysis
- `bias_only` - Only bias detection

**Response:**
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
      "Safety risk score: 22/100",
      "Bias score: 15/100"
    ],
    "biasAnalysis": {
      "score": 15,
      "types": ["demographic"],
      "details": "...",
      "recommendations": []
    },
    "safetyAnalysis": {
      "score": 22,
      "riskLevel": "low",
      "categoriesDetected": [],
      "details": "..."
    },
    "timestamp": "2026-05-02T12:30:00Z",
    "scanType": "comprehensive",
    "contentLength": 150,
    "modelVersions": {
      "hap": "ibm/granite-guardian-hap-38m",
      "bias": "ibm/granite-guardian-3-8b"
    }
  }
}
```

## Trust Score Calculation

The trust score (0-100) is calculated as:

```
trust_score = (safety_trust * 0.6) + (bias_trust * 0.4)

where:
  safety_trust = 100 - safety_score
  bias_trust = 100 - bias_score
```

**Risk Levels:**
- **Green (71-100)**: High trust, low risk
- **Yellow (41-70)**: Medium risk, needs attention
- **Red (0-40)**: High risk, critical issues

## Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### Test Scan
```bash
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test prompt for AI model evaluation",
    "scan_type": "comprehensive"
  }'
```

## Error Handling

The service handles:
- Missing credentials (503 Service Unavailable)
- API failures (500 Internal Server Error)
- Invalid requests (422 Validation Error)

## Integration with Frontend

The response format matches the frontend dashboard expectations:
- `trustScore` - Displayed in TrustScoreGauge component
- `riskFactors` - Shown in NutritionLabel component
- `biasAnalysis` & `safetyAnalysis` - Detailed analysis panels

## Next Steps

1. Add response caching for demo scenarios
2. Implement rate limiting
3. Add authentication/authorization
4. Create audit history logging
5. Add more granular bias categories

## Troubleshooting

**Import Errors:**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check Python version: Requires Python 3.10+

**Credential Errors:**
- Verify `.env` file exists and contains valid credentials
- Check IBM Cloud console for API key status
- Ensure Project ID is correct

**Model Errors:**
- Verify watsonx.ai service is active
- Check model availability in your region
- Review IBM Cloud service status

## Made with Bob
IBM Hackathon 2024 - EthosEngine Demo