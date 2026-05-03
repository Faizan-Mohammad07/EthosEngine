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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon demo, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ScanRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)
    scan_type: Optional[str] = "comprehensive"

class HealthResponse(BaseModel):
    status: str
    message: str

class ScanResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

# Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    logger.info("Health check requested")
    return HealthResponse(status="healthy", message="EthosEngine API is running")

@app.post("/api/scan", response_model=ScanResponse)
async def scan_content(request: ScanRequest):
    logger.info(f"Scan requested for content of length: {len(request.content)}")
    
    if granite_service is None:
        raise HTTPException(
            status_code=503,
            detail="IBM Granite Guardian service not configured. Check your .env file."
        )
    
    try:
        # 1. Perform the real scan via IBM watsonx.ai
        raw_results = await granite_service.scan_content(
            content=request.content,
            scan_type=request.scan_type
        )
        
        # 2. Format results specifically for our Carbon Design frontend
        formatted_results = ResponseFormatter.format_scan_result(raw_results)
        
        logger.info(f"Scan completed successfully. Trust Score: {formatted_results.get('trustScore')}")
        
        return ScanResponse(
            success=True,
            message="Content analyzed successfully using IBM Granite Guardian",
            data=formatted_results
        )
    except Exception as e:
        logger.error(f"Scan failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"name": "EthosEngine API", "status": "active", "integration": "IBM Granite Guardian"}
