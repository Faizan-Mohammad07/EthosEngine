# CORS & Error Handling Implementation
**Task 4 - Priority 2: Backend Foundation**

## Overview
This document describes the comprehensive CORS and error handling implementation for the EthosEngine backend API.

## 🔒 CORS Configuration

### Features Implemented
1. **Environment-Based Origins**
   - Configurable via `CORS_ORIGINS` environment variable
   - Comma-separated list of allowed origins
   - Falls back to development defaults if not set

2. **Default Development Origins**
   ```
   - http://localhost:5173 (Vite default)
   - http://localhost:3000 (React default)
   - http://127.0.0.1:5173
   - http://127.0.0.1:3000
   ```

3. **CORS Settings**
   - **Methods**: GET, POST, PUT, DELETE, OPTIONS
   - **Headers**: All headers allowed
   - **Credentials**: Enabled
   - **Max Age**: 3600 seconds (1 hour preflight cache)

### Configuration

#### Development
No configuration needed - uses default localhost origins.

#### Production
Set the `CORS_ORIGINS` environment variable:

```bash
# Single origin
CORS_ORIGINS=https://yourdomain.com

# Multiple origins
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com,https://admin.yourdomain.com
```

#### Example .env
```env
# CORS Configuration (optional)
CORS_ORIGINS=http://localhost:5173,https://ethos-engine.vercel.app
```

### Code Implementation
```python
def get_cors_origins() -> List[str]:
    """Get CORS allowed origins from environment or use defaults."""
    env_origins = os.getenv("CORS_ORIGINS", "")
    if env_origins:
        return [origin.strip() for origin in env_origins.split(",")]
    
    return [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)
```

---

## 🚨 Error Handling

### Error Response Format
All errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "type": "error_type",
    "message": "Human-readable error message",
    "timestamp": "2026-05-02T13:30:00Z",
    "details": []  // Optional, for validation errors
  }
}
```

### Error Types

#### 1. Validation Errors (422)
**Triggered by**: Invalid request data

**Response Example**:
```json
{
  "success": false,
  "error": {
    "type": "validation_error",
    "message": "Request validation failed",
    "details": [
      {
        "field": "body -> content",
        "message": "Content cannot be empty or only whitespace",
        "type": "value_error"
      }
    ],
    "timestamp": "2026-05-02T13:30:00Z"
  }
}
```

**Common Validation Rules**:
- `content`: 1-10,000 characters, not empty/whitespace
- `scan_type`: Must be "comprehensive", "safety_only", or "bias_only"

#### 2. HTTP Errors (4xx, 5xx)
**Triggered by**: HTTP exceptions (404, 503, etc.)

**Response Example**:
```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "IBM Granite Guardian service not configured",
    "status_code": 503,
    "timestamp": "2026-05-02T13:30:00Z"
  }
}
```

#### 3. Internal Server Errors (500)
**Triggered by**: Unexpected exceptions

**Response Example**:
```json
{
  "success": false,
  "error": {
    "type": "internal_error",
    "message": "An unexpected error occurred. Please try again later.",
    "timestamp": "2026-05-02T13:30:00Z"
  }
}
```

**Note**: Internal errors are logged with full stack traces but return generic messages to clients for security.

---

## 📝 Request Validation

### ScanRequest Model

```python
class ScanRequest(BaseModel):
    content: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Content to scan for bias and safety issues"
    )
    scan_type: Optional[str] = Field(
        default="comprehensive",
        description="Type of scan: comprehensive, safety_only, or bias_only"
    )
    
    @validator('content')
    def content_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Content cannot be empty or only whitespace')
        return v.strip()
    
    @validator('scan_type')
    def validate_scan_type(cls, v):
        allowed_types = ['comprehensive', 'safety_only', 'bias_only']
        if v and v not in allowed_types:
            raise ValueError(f'scan_type must be one of: {", ".join(allowed_types)}')
        return v or 'comprehensive'
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| content | Required | Field required |
| content | 1-10,000 chars | String should have at least 1 character / at most 10000 characters |
| content | Not whitespace | Content cannot be empty or only whitespace |
| scan_type | Optional | - |
| scan_type | Enum | scan_type must be one of: comprehensive, safety_only, bias_only |

---

## 🔍 Exception Handlers

### 1. Validation Exception Handler
```python
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors with detailed error messages."""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "type": "validation_error",
                "message": "Request validation failed",
                "details": errors,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }
    )
```

### 2. HTTP Exception Handler
```python
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent error format."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "type": "http_error",
                "message": exc.detail,
                "status_code": exc.status_code,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }
    )
```

### 3. General Exception Handler
```python
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions with safe error messages."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "type": "internal_error",
                "message": "An unexpected error occurred. Please try again later.",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }
    )
```

---

## 🧪 Testing

### Running Tests
```bash
# Install test dependencies
pip install pytest

# Run all error handling tests
python backend/test_error_handling.py

# Or use pytest directly
pytest backend/test_error_handling.py -v
```

### Test Coverage
- ✅ CORS headers presence
- ✅ CORS allowed origins
- ✅ Empty content rejection
- ✅ Whitespace-only content rejection
- ✅ Invalid scan_type rejection
- ✅ Valid scan_types acceptance
- ✅ Content length validation
- ✅ Missing required fields
- ✅ Error response format
- ✅ HTTP error handling
- ✅ Service unavailable errors
- ✅ Health check endpoint
- ✅ Root endpoint

---

## 🛡️ Security Considerations

### 1. Error Message Safety
- Internal errors return generic messages to clients
- Detailed errors are logged server-side only
- No sensitive information in error responses

### 2. CORS Security
- Explicit origin whitelist (no wildcards in production)
- Credentials enabled only for trusted origins
- Preflight caching reduces overhead

### 3. Input Validation
- Content length limits prevent DoS
- Whitespace trimming prevents empty submissions
- Enum validation for scan_type prevents injection

### 4. Logging
- All errors logged with timestamps
- Request paths included in logs
- Stack traces for debugging (server-side only)

---

## 📊 Rate Limiting (Future Enhancement)

### Recommended Implementation
For production deployment, consider adding rate limiting:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/scan")
@limiter.limit("10/minute")
async def scan_content(request: Request, scan_request: ScanRequest):
    # ... existing code
```

### Suggested Limits
- `/api/scan`: 10 requests/minute per IP
- `/health`: 60 requests/minute per IP
- Global: 100 requests/minute per IP

---

## 📚 API Documentation

### Interactive Docs
FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These docs include:
- All endpoints with request/response schemas
- Validation rules
- Error response examples
- Try-it-out functionality

---

## ✅ Task Completion Checklist

- [x] CORS configuration with environment-based origins
- [x] Comprehensive error handling middleware
- [x] Detailed request validation with custom validators
- [x] Consistent error response format
- [x] Exception handlers for all error types
- [x] Test suite for error handling
- [x] Documentation for CORS and error handling
- [x] Security considerations documented
- [x] Rate limiting recommendations
- [x] Updated .env.example with CORS_ORIGINS

---

## 🔗 Related Files

- `backend/main.py` - Main application with CORS and error handlers
- `backend/test_error_handling.py` - Comprehensive test suite
- `backend/.env.example` - Environment variable examples
- `backend/requirements.txt` - Updated with pytest

---

**Implementation Date**: 2026-05-02  
**Task**: Priority 2, Task 4 - CORS & Error Handling  
**Status**: ✅ Complete