# Components Directory

This directory contains all React components for the EthosEngine dashboard.

## Planned Components (Priority #1 - Hour 0-4)

### 1. Dashboard.jsx
Main dashboard layout with IBM Carbon header, sidebar navigation, and responsive grid layout.

### 2. NutritionLabel.jsx
AI Nutrition Label component displaying:
- Data ingredients (training data sources)
- Risk factors (bias indicators, safety concerns)
- Last audit timestamp
- Uses Carbon tiles and structured lists

### 3. TrustScoreGauge.jsx
Animated circular gauge component showing:
- Trust score (0-100)
- Color-coded risk levels:
  - 🔴 Red (0-40): High risk
  - 🟡 Yellow (41-70): Medium risk
  - 🟢 Green (71-100): Low risk
- Smooth animations on component mount

### 4. ScanButton.jsx
IBM Carbon button component with:
- Loading state
- Trigger for API calls
- Loading skeleton while scanning

## Component Structure

Each component should follow this pattern:
```jsx
import { Component } from '@carbon/react';
import './ComponentName.css';

function ComponentName({ props }) {
  // Component logic
  return (
    // JSX
  );
}

export default ComponentName;
```

## IBM Carbon Design System

All components use IBM Carbon components and follow Carbon Design Language principles:
- Consistent spacing and typography
- Carbon motion principles for animations
- IBM color palette
- Accessible by default