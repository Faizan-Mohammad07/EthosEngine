"""
Response Formatter Utility

This module contains utilities for formatting IBM Granite Guardian responses
into a structure optimized for the frontend dashboard.

It handles:
- Converting raw Granite Guardian output to frontend-friendly format
- Calculating and normalizing trust scores
- Formatting risk categories and severity levels
- Structuring data for the "Nutrition Label" style display
- Adding metadata and timestamps
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class ResponseFormatter:
    """
    Utility class for formatting Granite Guardian responses for the frontend.
    
    Transforms raw API responses into the structured format expected by
    the EthosEngine dashboard components.
    """
    
    @staticmethod
    def format_scan_result(raw_response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format a Granite Guardian scan result for frontend consumption.
        
        Args:
            raw_response: Raw response from Granite Guardian service
            
        Returns:
            Formatted response dictionary matching frontend schema:
            {
                "trustScore": 78,
                "riskLevel": "yellow",
                "dataIngredients": [...],
                "riskFactors": [...],
                "biasAnalysis": {...},
                "safetyAnalysis": {...},
                "timestamp": "2026-05-02T07:52:41Z"
            }
        """
        logger.info("Formatting scan result for frontend")
        
        trust_score = raw_response.get("trust_score", 0)
        safety_analysis = raw_response.get("safety_analysis", {})
        bias_analysis = raw_response.get("bias_analysis", {})
        
        # Determine risk level based on trust score
        risk_level = ResponseFormatter._determine_risk_level(trust_score)
        
        # Format data ingredients (sources of analysis)
        data_ingredients = ResponseFormatter._format_data_ingredients(raw_response)
        
        # Format risk factors
        risk_factors = ResponseFormatter._format_risk_factors(safety_analysis, bias_analysis)
        
        return {
            "trustScore": trust_score,
            "riskLevel": risk_level,
            "dataIngredients": data_ingredients,
            "riskFactors": risk_factors,
            "biasAnalysis": {
                "score": bias_analysis.get("bias_score", 0),
                "types": bias_analysis.get("bias_types", []),
                "details": bias_analysis.get("details", ""),
                "recommendations": bias_analysis.get("recommendations", [])
            },
            "safetyAnalysis": {
                "score": safety_analysis.get("safety_score", 0),
                "riskLevel": safety_analysis.get("risk_level", "unknown"),
                "categoriesDetected": safety_analysis.get("categories_detected", []),
                "details": safety_analysis.get("details", "")
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "scanType": raw_response.get("scan_type", "comprehensive"),
            "contentLength": raw_response.get("content_length", 0),
            "modelVersions": raw_response.get("model_versions", {})
        }
    
    @staticmethod
    def _determine_risk_level(trust_score: int) -> str:
        """
        Determine risk level from trust score.
        
        Args:
            trust_score: Trust score (0-100)
            
        Returns:
            Risk level: "green", "yellow", or "red"
        """
        if trust_score >= 71:
            return "green"
        elif trust_score >= 41:
            return "yellow"
        else:
            return "red"
    
    @staticmethod
    def _format_data_ingredients(raw_response: Dict[str, Any]) -> List[str]:
        """
        Format data ingredients for the nutrition label.
        
        Args:
            raw_response: Raw response from Granite Guardian
            
        Returns:
            List of data ingredient descriptions
        """
        ingredients = [
            "IBM Granite Guardian HAP Model",
            "IBM Granite Guardian Bias Detection Model"
        ]
        
        scan_type = raw_response.get("scan_type", "comprehensive")
        if scan_type == "comprehensive":
            ingredients.append("Comprehensive multi-model analysis")
        elif scan_type == "safety_only":
            ingredients = [ingredients[0], "Safety-focused analysis"]
        elif scan_type == "bias_only":
            ingredients = [ingredients[1], "Bias-focused analysis"]
        
        return ingredients
    
    @staticmethod
    def _format_risk_factors(
        safety_analysis: Dict[str, Any],
        bias_analysis: Dict[str, Any]
    ) -> List[str]:
        """
        Format risk factors for display.
        
        Args:
            safety_analysis: Safety analysis results
            bias_analysis: Bias analysis results
            
        Returns:
            List of formatted risk factor strings
        """
        risk_factors = []
        
        # Add safety risk factors
        safety_score = safety_analysis.get("safety_score", 0)
        if safety_score > 0:
            risk_factors.append(f"Safety risk score: {safety_score}/100")
        
        categories = safety_analysis.get("categories_detected", [])
        if categories:
            risk_factors.append(f"Detected categories: {', '.join(categories)}")
        
        # Add bias risk factors
        bias_score = bias_analysis.get("bias_score", 0)
        if bias_score > 0:
            risk_factors.append(f"Bias score: {bias_score}/100")
        
        bias_types = bias_analysis.get("bias_types", [])
        if bias_types:
            risk_factors.append(f"Bias types: {', '.join(bias_types)}")
        
        # If no risk factors, add a positive message
        if not risk_factors:
            risk_factors.append("No significant risks detected")
        
        return risk_factors
    
    @staticmethod
    def format_error_response(error: Exception, context: str = "") -> Dict[str, Any]:
        """
        Format an error response for the frontend.
        
        Args:
            error: The exception that occurred
            context: Additional context about where the error occurred
            
        Returns:
            Formatted error response dictionary
        """
        logger.error(f"Formatting error response: {str(error)}")
        
        return {
            "success": False,
            "error": {
                "message": str(error),
                "context": context,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }

# Made with Bob
