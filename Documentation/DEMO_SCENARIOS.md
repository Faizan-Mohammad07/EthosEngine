# EthosEngine Demo Scenarios
## Realistic AI Audit Examples for IBM Hackathon Demo

This document contains three pre-configured demo scenarios that showcase different risk levels and audit outcomes using IBM Granite Guardian technology.

---

## 🎯 Scenario 1: HR Hiring AI - High Bias Detected
**Use Case**: Automated resume screening and candidate ranking system  
**Risk Level**: 🔴 **RED** (Critical Issues)  
**Trust Score**: 34/100

### Input Prompt
```
Analyze this AI hiring assistant that screens resumes and ranks candidates for software engineering positions. The system was trained on 10 years of historical hiring data from our company and uses natural language processing to evaluate candidate qualifications.
```

### Expected Audit Results

#### Trust Score Breakdown
- **Overall Score**: 34/100 (High Risk)
- **Bias Score**: 18/100 (Critical)
- **Safety Score**: 62/100 (Moderate)
- **Transparency Score**: 22/100 (Low)

#### Data Ingredients
```json
{
  "trainingData": [
    "10 years historical hiring records (2014-2024)",
    "Internal resume database (15,000 candidates)",
    "Job description corpus (500+ positions)",
    "Performance review data (confidential)"
  ],
  "dataQuality": "Medium - Historical bias present",
  "dataVolume": "15,000 resumes, 500 job descriptions",
  "lastUpdated": "2024-03-15"
}
```

#### Risk Factors Detected
```json
{
  "criticalIssues": [
    {
      "type": "Demographic Bias",
      "severity": "HIGH",
      "description": "Gender bias detected: 78% male candidates in training data",
      "impact": "May systematically disadvantage female candidates",
      "confidence": 0.92
    },
    {
      "type": "Age Discrimination Risk",
      "severity": "HIGH",
      "description": "Age correlation in hiring patterns (favors 25-35 age range)",
      "impact": "Potential age discrimination in candidate ranking",
      "confidence": 0.87
    }
  ],
  "moderateIssues": [
    {
      "type": "Educational Institution Bias",
      "severity": "MEDIUM",
      "description": "Over-representation of specific universities (65% from top 10 schools)",
      "impact": "May disadvantage candidates from diverse educational backgrounds",
      "confidence": 0.76
    },
    {
      "type": "Geographic Bias",
      "severity": "MEDIUM",
      "description": "Location bias detected (82% candidates from urban areas)",
      "impact": "Rural candidates may be systematically ranked lower",
      "confidence": 0.71
    }
  ]
}
```

#### Bias Analysis
```json
{
  "genderBias": {
    "score": 18,
    "details": "Significant gender imbalance in training data",
    "recommendation": "Retrain with balanced dataset, implement fairness constraints"
  },
  "ageBias": {
    "score": 22,
    "details": "Age-related patterns favor younger candidates",
    "recommendation": "Remove age-correlated features, audit decision logic"
  },
  "ethnicityBias": {
    "score": 45,
    "details": "Moderate ethnic representation issues",
    "recommendation": "Diversify training data, implement bias mitigation"
  }
}
```

#### Safety Analysis
```json
{
  "harmfulContent": {
    "score": 85,
    "status": "PASS",
    "details": "No harmful content generation detected"
  },
  "privacyRisks": {
    "score": 42,
    "status": "CONCERN",
    "details": "PII exposure risk in candidate profiles",
    "recommendation": "Implement data anonymization, review access controls"
  },
  "regulatoryCompliance": {
    "score": 35,
    "status": "FAIL",
    "details": "Non-compliant with EU AI Act Article 6 (High-Risk AI)",
    "recommendation": "Implement human oversight, bias monitoring, audit trails"
  }
}
```

#### Recommended Actions
1. **IMMEDIATE**: Suspend system deployment until bias issues resolved
2. **HIGH PRIORITY**: Retrain model with demographically balanced dataset
3. **HIGH PRIORITY**: Implement fairness constraints and bias mitigation algorithms
4. **MEDIUM PRIORITY**: Add human-in-the-loop review for all hiring decisions
5. **MEDIUM PRIORITY**: Establish ongoing bias monitoring and audit procedures

---

## 🎯 Scenario 2: Financial Advisor AI - Low Risk, High Trust
**Use Case**: Personal investment recommendation chatbot  
**Risk Level**: 🟢 **GREEN** (Low Risk)  
**Trust Score**: 87/100

### Input Prompt
```
Evaluate this AI financial advisor chatbot that provides personalized investment recommendations. The system uses IBM watsonx.ai, is trained on publicly available financial data, SEC filings, and market analysis reports. It includes risk disclaimers and encourages users to consult human advisors for major decisions.
```

### Expected Audit Results

#### Trust Score Breakdown
- **Overall Score**: 87/100 (High Trust)
- **Bias Score**: 82/100 (Good)
- **Safety Score**: 91/100 (Excellent)
- **Transparency Score**: 88/100 (Excellent)

#### Data Ingredients
```json
{
  "trainingData": [
    "Public financial market data (NYSE, NASDAQ, 2010-2024)",
    "SEC filings and regulatory documents",
    "Economic indicators (Federal Reserve, World Bank)",
    "Financial news articles (Bloomberg, Reuters)",
    "Investment strategy whitepapers (peer-reviewed)"
  ],
  "dataQuality": "High - Verified, publicly available sources",
  "dataVolume": "2.5M documents, 14 years historical data",
  "lastUpdated": "2024-04-28"
}
```

#### Risk Factors Detected
```json
{
  "minorIssues": [
    {
      "type": "Market Volatility Sensitivity",
      "severity": "LOW",
      "description": "Recommendations may be overly influenced by recent market trends",
      "impact": "Could lead to reactive rather than strategic advice",
      "confidence": 0.68
    },
    {
      "type": "Limited International Coverage",
      "severity": "LOW",
      "description": "Training data weighted toward US markets (78%)",
      "impact": "May provide less accurate advice for international investments",
      "confidence": 0.72
    }
  ]
}
```

#### Bias Analysis
```json
{
  "demographicBias": {
    "score": 82,
    "details": "Minimal demographic bias detected",
    "recommendation": "Continue monitoring, maintain diverse data sources"
  },
  "socioeconomicBias": {
    "score": 78,
    "details": "Slight bias toward higher-income investment strategies",
    "recommendation": "Expand coverage of budget-friendly investment options"
  },
  "geographicBias": {
    "score": 85,
    "details": "Good geographic diversity in recommendations",
    "recommendation": "Maintain current data sourcing practices"
  }
}
```

#### Safety Analysis
```json
{
  "harmfulContent": {
    "score": 95,
    "status": "PASS",
    "details": "No harmful financial advice patterns detected"
  },
  "privacyRisks": {
    "score": 88,
    "status": "PASS",
    "details": "Strong data protection measures in place",
    "recommendation": "Continue encryption and access control practices"
  },
  "regulatoryCompliance": {
    "score": 91,
    "status": "PASS",
    "details": "Compliant with SEC regulations and EU AI Act",
    "recommendation": "Maintain current compliance monitoring"
  },
  "riskDisclosures": {
    "score": 92,
    "status": "PASS",
    "details": "Appropriate risk warnings and disclaimers present",
    "recommendation": "Continue clear communication of investment risks"
  }
}
```

#### Recommended Actions
1. **LOW PRIORITY**: Expand international market data coverage
2. **LOW PRIORITY**: Add more budget-friendly investment strategy content
3. **MAINTENANCE**: Continue quarterly bias audits
4. **MAINTENANCE**: Monitor regulatory changes and update compliance measures

---

## 🎯 Scenario 3: Healthcare Chatbot - Medium Risk, Safety Concerns
**Use Case**: Medical symptom checker and health information assistant  
**Risk Level**: 🟡 **YELLOW** (Moderate Risk)  
**Trust Score**: 64/100

### Input Prompt
```
Assess this healthcare chatbot that helps users understand symptoms and provides general health information. The system was trained on medical literature, patient forums, and health websites. It includes disclaimers that it's not a substitute for professional medical advice.
```

### Expected Audit Results

#### Trust Score Breakdown
- **Overall Score**: 64/100 (Moderate Risk)
- **Bias Score**: 58/100 (Needs Improvement)
- **Safety Score**: 67/100 (Moderate)
- **Transparency Score**: 68/100 (Acceptable)

#### Data Ingredients
```json
{
  "trainingData": [
    "Medical literature and research papers (PubMed, 50,000 articles)",
    "Patient health forums and Q&A sites (Reddit, WebMD)",
    "Health information websites (Mayo Clinic, NHS)",
    "Symptom databases (ICD-10, medical textbooks)",
    "User-generated health content (mixed quality)"
  ],
  "dataQuality": "Mixed - Combination of verified and unverified sources",
  "dataVolume": "50,000 medical articles, 200,000 forum posts",
  "lastUpdated": "2024-04-10"
}
```

#### Risk Factors Detected
```json
{
  "criticalIssues": [
    {
      "type": "Medical Misinformation Risk",
      "severity": "HIGH",
      "description": "Training data includes unverified patient forums (30% of corpus)",
      "impact": "May provide inaccurate or misleading health information",
      "confidence": 0.84
    }
  ],
  "moderateIssues": [
    {
      "type": "Demographic Health Disparities",
      "severity": "MEDIUM",
      "description": "Training data over-represents certain demographics",
      "impact": "May not accurately address health concerns of underrepresented groups",
      "confidence": 0.79
    },
    {
      "type": "Rare Disease Coverage Gap",
      "severity": "MEDIUM",
      "description": "Limited information on rare conditions (<1% of training data)",
      "impact": "May provide inadequate guidance for uncommon health issues",
      "confidence": 0.81
    },
    {
      "type": "Mental Health Sensitivity",
      "severity": "MEDIUM",
      "description": "Insufficient training on mental health crisis detection",
      "impact": "May fail to identify users in mental health emergencies",
      "confidence": 0.76
    }
  ]
}
```

#### Bias Analysis
```json
{
  "genderBias": {
    "score": 62,
    "details": "Some gender-specific health conditions underrepresented",
    "recommendation": "Expand training data for women's health topics"
  },
  "ageBias": {
    "score": 55,
    "details": "Pediatric and geriatric health information limited",
    "recommendation": "Add age-specific medical literature and guidelines"
  },
  "ethnicityBias": {
    "score": 51,
    "details": "Health disparities and ethnic-specific conditions underrepresented",
    "recommendation": "Include diverse medical research and population health data"
  }
}
```

#### Safety Analysis
```json
{
  "harmfulContent": {
    "score": 72,
    "status": "CONCERN",
    "details": "Potential for harmful medical advice from unverified sources",
    "recommendation": "Filter training data, prioritize peer-reviewed sources"
  },
  "privacyRisks": {
    "score": 81,
    "status": "PASS",
    "details": "HIPAA-compliant data handling, but user input monitoring needed",
    "recommendation": "Implement stricter PII detection and anonymization"
  },
  "regulatoryCompliance": {
    "score": 58,
    "status": "CONCERN",
    "details": "Borderline compliance with FDA guidance on medical AI",
    "recommendation": "Add medical professional review, strengthen disclaimers"
  },
  "crisisDetection": {
    "score": 45,
    "status": "FAIL",
    "details": "Insufficient mental health crisis and emergency detection",
    "recommendation": "Implement crisis keyword detection, emergency resource routing"
  }
}
```

#### Recommended Actions
1. **HIGH PRIORITY**: Implement medical professional review process for all responses
2. **HIGH PRIORITY**: Add mental health crisis detection and emergency routing
3. **HIGH PRIORITY**: Filter training data to prioritize peer-reviewed medical sources
4. **MEDIUM PRIORITY**: Expand training data for underrepresented demographics
5. **MEDIUM PRIORITY**: Strengthen medical disclaimers and limitations
6. **MEDIUM PRIORITY**: Add rare disease information from specialized medical databases
7. **LOW PRIORITY**: Implement ongoing medical accuracy monitoring

---

## 📊 Scenario Comparison Matrix

| Metric | HR Hiring AI | Financial Advisor | Healthcare Chatbot |
|--------|--------------|-------------------|-------------------|
| **Trust Score** | 34/100 🔴 | 87/100 🟢 | 64/100 🟡 |
| **Bias Score** | 18/100 | 82/100 | 58/100 |
| **Safety Score** | 62/100 | 91/100 | 67/100 |
| **Transparency** | 22/100 | 88/100 | 68/100 |
| **Risk Level** | Critical | Low | Moderate |
| **Deployment Status** | ❌ Block | ✅ Approve | ⚠️ Conditional |
| **IBM Tech Used** | Granite Guardian | Granite Guardian + watsonx.ai | Granite Guardian |

---

## 🎬 Demo Flow Recommendations

### Opening (30 seconds)
"Let me show you how EthosEngine audits AI systems in real-time using IBM Granite Guardian technology."

### Scenario 1 - HR AI (90 seconds)
1. Paste HR hiring AI prompt
2. Click "Scan AI System"
3. Watch trust score animate to RED (34/100)
4. Highlight critical bias issues
5. **Key Point**: "This system would violate EU AI Act regulations and expose the company to discrimination lawsuits"

### Scenario 2 - Financial AI (60 seconds)
1. Paste financial advisor prompt
2. Click "Scan AI System"
3. Watch trust score animate to GREEN (87/100)
4. Show clean audit results
5. **Key Point**: "This system is deployment-ready with minimal risk"

### Scenario 3 - Healthcare AI (90 seconds)
1. Paste healthcare chatbot prompt
2. Click "Scan AI System"
3. Watch trust score animate to YELLOW (64/100)
4. Highlight safety concerns
5. **Key Point**: "This system needs improvements before deployment, especially crisis detection"

### Closing (30 seconds)
"EthosEngine provides instant, actionable insights powered by IBM's enterprise AI technology, helping companies deploy AI responsibly and stay compliant."

---

## 🔧 Implementation Notes

### Mock Data Integration
These scenarios should be pre-loaded in the frontend for quick demo switching:

```javascript
// frontend/src/data/demoScenarios.js
export const DEMO_SCENARIOS = {
  hrHiring: { /* Scenario 1 data */ },
  financialAdvisor: { /* Scenario 2 data */ },
  healthcareBot: { /* Scenario 3 data */ }
};
```

### Quick Scenario Switcher
Add buttons in the dashboard to instantly load each scenario:
- "Load HR Hiring Demo"
- "Load Financial Advisor Demo"
- "Load Healthcare Chatbot Demo"

### Timing Considerations
- Each scan animation: 3-5 seconds
- Trust score animation: 2 seconds
- Total demo time: 4-5 minutes (all scenarios)

---

*Generated: 2026-05-02*  
*Purpose: IBM Hackathon Demo*  
*Status: Ready for Implementation*