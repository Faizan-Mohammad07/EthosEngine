

I'll analyze the task and break it down into subtasks for completion.

Looking at the document, Priority 2, Task 3 is:

Hour 4-8: Backend Foundation - Task 3: Response Formatter

Create response_formatter.py to transform Granite output to dashboard-friendly JSON
Implement the specified JSON structure with trustScore, riskLevel, dataIngredients, etc.
Let me check the current state of the backend to understand what's already been completed.




I need to delegate this task to the appropriate mode. Since this involves implementing code for the response formatter, I'll create a subtask in Code mode.


I want to create a new subtask in 💻 Code mode:
Subtask Instructions
Complete Priority 2, Task 3 from the 24hr hackathon plan: Implement the Response Formatter.

Context: This is part of the backend foundation for the EthosEngine demo. The backend uses FastAPI with IBM Granite Guardian integration. Task 1 (FastAPI setup) and Task 2 (Granite Guardian integration) should already be completed.

Your specific task: Implement response_formatter.py that transforms Granite Guardian output into dashboard-friendly JSON.

Requirements:

Create/update the file at backend/utils/response_formatter.py
Implement a function that transforms Granite Guardian model output into the following JSON structure:
{
  "trustScore": 78,
  "riskLevel": "yellow",
  "dataIngredients": [...],
  "riskFactors": [...],
  "biasAnalysis": {...},
  "safetyAnalysis": {...},
  "timestamp": "2026-05-02T07:52:41Z"
}

The formatter should:

Calculate a trustScore (0-100) based on Granite Guardian's bias and safety analysis
Determine riskLevel: "green" (71-100), "yellow" (41-70), "red" (0-40)
Extract and format data ingredients from the analysis
Extract and format risk factors
Include detailed biasAnalysis and safetyAnalysis objects
Add ISO 8601 timestamp
Handle edge cases and errors gracefully

Ensure the output is compatible with the frontend components (Dashboard, NutritionLabel, TrustScoreGauge)

Scope: ONLY implement the response formatter utility. Do not modify other backend files unless absolutely necessary for integration. Do not work on frontend, testing, or documentation.

Completion: When finished, use attempt_completion with a concise summary of what was implemented, including the file path and key functionality added.

These instructions supersede any conflicting general instructions your mode might have.


What's on your mind?

🔀 Orchestrator