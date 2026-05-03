"""
IBM Granite Guardian Service

This module integrates with IBM Granite Guardian for AI content analysis.
It handles:
- Authentication with IBM watsonx.ai
- Content submission to Granite Guardian models
- Response parsing and error handling
- Bias and safety risk assessment
"""

import logging
from typing import Dict, Any, Optional, List
from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
import re

logger = logging.getLogger(__name__)


class GraniteService:
    """
    Service class for IBM Granite Guardian integration.
    
    Manages interactions with IBM's Granite Guardian models for
    AI content integrity analysis including bias and safety detection.
    """
    
    # Granite Guardian model IDs
    GRANITE_GUARDIAN_HAP = "ibm/granite-guardian-hap-38m"  # Hate, Abuse, Profanity
    GRANITE_GUARDIAN_BIAS = "ibm/granite-guardian-3-8b"    # Bias detection
    
    def __init__(self, api_key: str, project_id: str, url: str):
        """
        Initialize the Granite Guardian service with IBM watsonx.ai credentials.
        
        Args:
            api_key: IBM watsonx.ai API key
            project_id: IBM watsonx.ai project ID
            url: IBM watsonx.ai service URL
        """
        self.api_key = api_key
        self.project_id = project_id
        self.url = url
        
        # Initialize IBM watsonx.ai credentials as a dictionary for maximum compatibility
        self.credentials = {
            "url": self.url,
            "apikey": self.api_key
        }
        
        logger.info("GraniteService initialized with IBM watsonx.ai credentials")
    
    def _create_model(self, model_id: str) -> Model:
        """
        Create a Model instance for the specified Granite Guardian model.
        
        Args:
            model_id: The Granite Guardian model ID
            
        Returns:
            Configured Model instance
        """
        parameters = {
            GenParams.MAX_NEW_TOKENS: 200,
            GenParams.TEMPERATURE: 0.1,
            GenParams.TOP_P: 0.9,
        }
        
        return Model(
            model_id=model_id,
            params=parameters,
            credentials=self.credentials,
            project_id=self.project_id
        )
    
    async def _analyze_safety(self, content: str) -> Dict[str, Any]:
        """
        Analyze content for hate, abuse, and profanity using Granite Guardian HAP.
        
        Args:
            content: The text content to analyze
            
        Returns:
            Dictionary with safety analysis results
        """
        try:
            model = self._create_model(self.GRANITE_GUARDIAN_HAP)
            
            prompt = f"""Analyze the following text for hate speech, abuse, and profanity.
Provide a risk score from 0-100 where 0 is completely safe and 100 is highly unsafe.

Text: {content}

Analysis:"""
            
            response = model.generate_text(prompt=prompt)
            safety_score = self._extract_safety_score(response)
            
            return {
                "safety_score": safety_score,
                "risk_level": self._calculate_risk_level(safety_score),
                "details": response,
                "categories_detected": self._extract_categories(response)
            }
        except Exception as e:
            logger.error(f"Safety analysis failed: {str(e)}")
            return {
                "safety_score": 50,
                "risk_level": "medium",
                "details": f"Analysis error: {str(e)}",
                "categories_detected": []
            }
    
    async def _analyze_bias(self, content: str) -> Dict[str, Any]:
        """
        Analyze content for bias using Granite Guardian bias detection.
        
        Args:
            content: The text content to analyze
            
        Returns:
            Dictionary with bias analysis results
        """
        try:
            model = self._create_model(self.GRANITE_GUARDIAN_BIAS)
            
            prompt = f"""Analyze the following text for potential biases including demographic, gender, racial, or cultural biases.
Provide a bias score from 0-100 where 0 is completely unbiased and 100 is highly biased.

Text: {content}

Analysis:"""
            
            response = model.generate_text(prompt=prompt)
            bias_score = self._extract_bias_score(response)
            
            return {
                "bias_score": bias_score,
                "bias_types": self._extract_bias_types(response),
                "details": response,
                "recommendations": self._generate_recommendations(bias_score)
            }
        except Exception as e:
            logger.error(f"Bias analysis failed: {str(e)}")
            return {
                "bias_score": 50,
                "bias_types": [],
                "details": f"Analysis error: {str(e)}",
                "recommendations": []
            }
    
    async def scan_content(self, content: str, scan_type: str = "comprehensive") -> Dict[str, Any]:
        """
        Scan content using IBM Granite Guardian for bias and safety.
        
        Args:
            content: User prompt or model description to analyze
            scan_type: Type of scan (comprehensive, safety_only, bias_only)
            
        Returns:
            Dictionary containing scan results with trust score and analysis
            
        Raises:
            Exception: If the scan fails
        """
        logger.info(f"Starting {scan_type} scan for content length: {len(content)}")
        
        try:
            # Perform safety and bias analysis
            if scan_type in ["comprehensive", "safety_only"]:
                safety_results = await self._analyze_safety(content)
            else:
                safety_results = {"safety_score": 100, "risk_level": "low"}
            
            if scan_type in ["comprehensive", "bias_only"]:
                bias_results = await self._analyze_bias(content)
            else:
                bias_results = {"bias_score": 0, "bias_types": []}
            
            # Calculate overall trust score
            trust_score = self._calculate_trust_score(
                safety_results.get("safety_score", 100),
                bias_results.get("bias_score", 0)
            )
            
            return {
                "trust_score": trust_score,
                "safety_analysis": safety_results,
                "bias_analysis": bias_results,
                "scan_type": scan_type,
                "content_length": len(content),
                "model_versions": {
                    "hap": self.GRANITE_GUARDIAN_HAP,
                    "bias": self.GRANITE_GUARDIAN_BIAS
                }
            }
        except Exception as e:
            logger.error(f"Content scan failed: {str(e)}")
            raise Exception(f"Granite Guardian scan failed: {str(e)}")
    
    def _extract_safety_score(self, response: str) -> int:
        """Extract safety score from model response."""
        numbers = re.findall(r'\b(\d+)\b', response)
        if numbers:
            score = int(numbers[0])
            return min(100, max(0, score))
        return 85
    
    def _extract_bias_score(self, response: str) -> int:
        """Extract bias score from model response."""
        numbers = re.findall(r'\b(\d+)\b', response)
        if numbers:
            score = int(numbers[0])
            return min(100, max(0, score))
        return 15
    
    def _calculate_risk_level(self, safety_score: int) -> str:
        """Calculate risk level from safety score."""
        if safety_score >= 70:
            return "high"
        elif safety_score >= 40:
            return "medium"
        else:
            return "low"
    
    def _extract_categories(self, response: str) -> List[str]:
        """Extract detected categories from response."""
        categories = []
        response_lower = response.lower()
        if "hate" in response_lower:
            categories.append("hate_speech")
        if "abuse" in response_lower or "abusive" in response_lower:
            categories.append("abuse")
        if "profanity" in response_lower:
            categories.append("profanity")
        return categories
    
    def _extract_bias_types(self, response: str) -> List[str]:
        """Extract bias types from response."""
        bias_types = []
        response_lower = response.lower()
        if "gender" in response_lower:
            bias_types.append("gender")
        if "racial" in response_lower or "race" in response_lower:
            bias_types.append("racial")
        if "demographic" in response_lower:
            bias_types.append("demographic")
        if "cultural" in response_lower:
            bias_types.append("cultural")
        return bias_types
    
    def _generate_recommendations(self, bias_score: int) -> List[str]:
        """Generate recommendations based on bias score."""
        recommendations = []
        if bias_score > 50:
            recommendations.append("Review content for potential demographic biases")
            recommendations.append("Consider diverse perspectives in content creation")
        if bias_score > 70:
            recommendations.append("Significant bias detected - content revision recommended")
        return recommendations
    
    def _calculate_trust_score(self, safety_score: int, bias_score: int) -> int:
        """
        Calculate overall trust score from safety and bias scores.
        
        Args:
            safety_score: Safety score (0-100, higher is less safe)
            bias_score: Bias score (0-100, higher is more biased)
            
        Returns:
            Trust score (0-100, higher is more trustworthy)
        """
        # Invert scores: lower risk = higher trust
        safety_trust = 100 - safety_score
        bias_trust = 100 - bias_score
        
        # Weighted average: 60% safety, 40% bias
        trust_score = int((safety_trust * 0.6) + (bias_trust * 0.4))
        
        return max(0, min(100, trust_score))

# Made with Bob
