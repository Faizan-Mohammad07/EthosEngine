# EthosEngine Backend

FastAPI backend for EthosEngine - AI Integrity Sentinel demo for IBM Hackathon 2024.

## Overview

This backend provides REST API endpoints for scanning AI-generated content using IBM Granite Guardian models. It integrates with IBM watsonx.ai to analyze content integrity and provide trust scores.

## Project Structure

```
backend/
├── main.py                      # FastAPI application entry point
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
├── services/
│   └── granite_service.py      # IBM Granite Guardian integration
└── utils/
    └── response_formatter.py   # Response formatting utilities
```

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- IBM watsonx.ai account with API credentials

## Quick Setup

### 1. Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example environment file and add your IBM credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your IBM watsonx.ai credentials:
```
IBM_WATSONX_API_KEY=your_actual_api_key
IBM_WATSONX_PROJECT_ID=your_actual_project_id
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### 4. Run the Development Server

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base URL:** http://localhost:8000
- **Interactive Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API.

### Scan Content
```
POST /api/scan
Content-Type: application/json

{
  "content": "Text content to analyze",
  "scan_type": "comprehensive"
}
```
Scans AI-generated content and returns trust score and analysis.

## Development

### Running Tests
```bash
# TODO: Add pytest configuration
pytest
```

### Code Formatting
```bash
# Install black for code formatting
pip install black
black .
```

### Linting
```bash
# Install flake8 for linting
pip install flake8
flake8 .
```

## CORS & Error Handling

Comprehensive CORS and error handling has been implemented. See [CORS_ERROR_HANDLING.md](./CORS_ERROR_HANDLING.md) for complete documentation.

### Key Features:
- **Environment-based CORS configuration** via `CORS_ORIGINS` env variable
- **Three-tier exception handling** (validation, HTTP, general errors)
- **Advanced request validation** with Pydantic validators
- **Consistent error response format** across all endpoints
- **Comprehensive test suite** in `test_error_handling.py`

### CORS Configuration:
```env
# Optional - defaults to localhost:5173 and localhost:3000
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Alternative frontend port)

Update `main.py` if you need to add additional origins.

## IBM Granite Guardian Integration

The IBM Granite Guardian integration is currently in placeholder state. The actual implementation will include:

- Authentication with IBM watsonx.ai
- Content submission to Granite Guardian models
- Risk assessment and scoring
- Detailed analysis of AI-generated content

## Troubleshooting

### Port Already in Use
If port 8000 is already in use, specify a different port:
```bash
uvicorn main:app --reload --port 8001
```

### Import Errors
Make sure your virtual environment is activated and all dependencies are installed:
```bash
pip install -r requirements.txt
```

### CORS Issues
If you encounter CORS errors, verify that your frontend URL is listed in the `allow_origins` list in `main.py`.

## Next Steps

1. Implement IBM Granite Guardian integration in `services/granite_service.py`
2. Add response formatting logic in `utils/response_formatter.py`
3. Implement comprehensive error handling
4. Add request validation and rate limiting
5. Set up logging and monitoring
6. Add unit and integration tests

## License

This project is part of the IBM Hackathon 2024 submission.

## Support

For issues or questions, please refer to the main project documentation in the `Documentation/` directory.