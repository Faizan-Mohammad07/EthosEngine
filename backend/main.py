"""
EthosEngine Backend - FastAPI Application
IBM Hackathon 2024 - AI Integrity Sentinel Demo

This is the main FastAPI application that serves as the backend for EthosEngine.
It provides endpoints for scanning AI-generated content using IBM Granite Guardian.
"""

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
from services.granite_service import GraniteService
from utils.response_formatter import ResponseFormatter

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="EthosEngine API",
    description="AI Integrity Sentinel - Backend API for scanning AI-generated content",
    version="1.0.0"
)

# Initialize IBM Granite Guardian Service
def get_granite_service() -> GraniteService:
    """
    Initialize and return GraniteService with IBM watsonx.ai credentials.
    
    Returns:
        GraniteService instance
        
    Raises:
        ValueError: If required environment variables are missing
    """
    api_key = os.getenv("IBM_WATSONX_API_KEY")
    project_id = os.getenv("IBM_WATSONX_PROJECT_ID")
    url = os.getenv("IBM_WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    
    if not api_key or not project_id:
        raise ValueError(
            "IBM watsonx.ai credentials not configured. "
            "Please set IBM_WATSONX_API_KEY and IBM_WATSONX_PROJECT_ID environment variables."
        )
    
    return GraniteService(api_key=api_key, project_id=project_id, url=url)

# Global granite service instance
granite_service: Optional[GraniteService] = None

@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup."""
    global granite_service
    try:
        granite_service = get_granite_service()
        logger.info("IBM Granite Guardian service initialized successfully")
    except ValueError as e:
        logger.warning(f"Granite service initialization skipped: {str(e)}")
        granite_service = None

# Configure CORS with environment-based origins
def get_cors_origins() -> List[str]:
    """
    Get CORS allowed origins from environment or use defaults.
    
    Returns:
        List of allowed origins
    """
    env_origins = os.getenv("CORS_ORIGINS", "")
    if env_origins:
        return [origin.strip() for origin in env_origins.split(",")]
    
    # Default origins for development
    return [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # React default
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
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Global exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle request validation errors with detailed error messages.
    
    Args:
        request: The incoming request
        exc: The validation error exception
        
    Returns:
        JSONResponse with detailed validation error information
    """
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    logger.warning(f"Validation error on {request.url.path}: {errors}")
    
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

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handle HTTP exceptions with consistent error format.
    
    Args:
        request: The incoming request
        exc: The HTTP exception
        
    Returns:
        JSONResponse with formatted error information
    """
    logger.error(f"HTTP {exc.status_code} on {request.url.path}: {exc.detail}")
    
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

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle unexpected exceptions with safe error messages.
    
    Args:
        request: The incoming request
        exc: The exception
        
    Returns:
        JSONResponse with generic error information
    """
    logger.error(f"Unexpected error on {request.url.path}: {str(exc)}", exc_info=True)
    
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

# Request/Response Models
class ScanRequest(BaseModel):
    """
    Request model for content scanning with validation.
    
    Attributes:
        content: The text content to scan (1-10000 characters)
        scan_type: Type of scan to perform (comprehensive, safety_only, bias_only)
    """
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
        """Validate that content is not just whitespace."""
        if not v or not v.strip():
            raise ValueError('Content cannot be empty or only whitespace')
        return v.strip()
    
    @validator('scan_type')
    def validate_scan_type(cls, v):
        """Validate scan_type is one of the allowed values."""
        allowed_types = ['comprehensive', 'safety_only', 'bias_only']
        if v and v not in allowed_types:
            raise ValueError(f'scan_type must be one of: {", ".join(allowed_types)}')
        return v or 'comprehensive'

class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    message: str

class ScanResponse(BaseModel):
    """Response model for scan results"""
    success: bool
    message: str
    data: Optional[dict] = None

# Health Check Endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        HealthResponse: Status and message indicating API health
    """
    logger.info("Health check requested")
    return HealthResponse(
        status="healthy",
        message="EthosEngine API is running"
    )

# Main Scan Endpoint - IBM Granite Guardian Integration
@app.post("/api/scan", response_model=ScanResponse)
async def scan_content(request: ScanRequest):
    """
    Scan user prompt or model description for bias and safety issues using IBM Granite Guardian.
    
    This endpoint processes content through IBM Granite Guardian models to detect:
    - Bias (demographic, gender, racial, cultural)
    - Safety issues (hate speech, abuse, profanity)
    
    Args:
        request: ScanRequest containing content to scan (user prompt/model description)
        
    Returns:
        ScanResponse: Scan results with trust score and detailed analysis
        
    Raises:
        HTTPException: If scanning fails or service is not configured
    """
    logger.info(f"Scan requested for content of length: {len(request.content)}")
    
    # Check if Granite service is initialized
    if granite_service is None:
        logger.error("Granite service not initialized")
        raise HTTPException(
            status_code=503,
            detail="IBM Granite Guardian service not configured. Please set up IBM watsonx.ai credentials."
        )
    
    try:
        # Process content with IBM Granite Guardian
        scan_results = await granite_service.scan_content(
            content=request.content,
            scan_type=request.scan_type or "comprehensive"
        )
        
        # Format response for frontend
        formatted_results = ResponseFormatter.format_scan_result(scan_results)
        
        logger.info(f"Scan completed. Trust score: {formatted_results.get('trustScore', 0)}")
        
        return ScanResponse(
            success=True,
            message="Content scanned successfully using IBM Granite Guardian",
            data=formatted_results
        )
    except Exception as e:
        logger.error(f"Scan failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scan failed: {str(e)}"
        )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "EthosEngine API",
        "version": "1.0.0",
        "description": "AI Integrity Sentinel Backend",
        "endpoints": {
            "health": "/health",
            "scan": "/api/scan",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Made with Bob
