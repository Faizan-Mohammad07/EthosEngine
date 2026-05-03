# Report Page Documentation

## Overview
The Report Page is a comprehensive audit report component that provides detailed analysis, insights, and actionable recommendations for AI model audits. It serves as the primary deliverable for stakeholders and regulatory bodies.

## Features

### 1. Executive Summary
**Purpose**: High-level overview of the audit results

**Components**:
- **Trust Score Hero Gauge**: Large circular gauge (0-100) showing model reliability
- **Audit Status Badge**: Visual indicator (Passed/Caution/Failed) based on regulatory standards
  - **Passed** (Green): Score ≥ 71
  - **Caution** (Yellow): Score 41-70
  - **Failed** (Red): Score ≤ 40
- **Metadata Section**: 
  - Audit timestamp
  - Model version
  - Scan type

**Visual Design**:
- Gradient background with border highlighting
- Color-coded status indicators
- Animated transitions

### 2. AI Nutrition Label
**Purpose**: Transparent disclosure of model characteristics

**Components**:
- **Data Ingredients**: Clear list of data sources used
  - Public Datasets
  - Proprietary Data
  - Synthetic Data
  - User Prompts
- **Critical Risk Factors**: High-level bullet points of safety and bias concerns
  - Bias detection results
  - Safety violations
  - Compliance issues

**Visual Design**:
- Card-based layout
- Icon-based indicators
- Color-coded risk levels

### 3. Deep-Dive Analysis
**Purpose**: Detailed technical analysis with visualizations

**Components**:
- **Bias Breakdown Chart**: 
  - Demographic bias
  - Gender bias
  - Age bias
  - Geographic bias
  - Interactive bar chart visualization
  
- **Safety Analysis Metrics**:
  - Toxicity Score (0-100)
  - PII Leakage Risk (Low/Medium/High)
  - Hate Speech Detection (Low/Medium/High)
  - Color-coded metric cards
  
- **IBM Granite Guardian Insights**:
  - AI-generated reasoning for scores
  - Confidence levels
  - Category-specific analysis
  - Direct explanations from the Granite model

**Visual Design**:
- Chart.js visualizations
- Metric cards with hover effects
- Insight cards with confidence tags

### 4. Remediation Roadmap
**Purpose**: Actionable steps for improvement

**Components**:
- **Fix Suggestions**: Concrete steps developers can take
  - Priority levels (Critical/High/Medium)
  - Category classification
  - Expected impact
  - Implementation timeline
  
- **Compliance Checklist**: Regulatory standard comparison
  - EU AI Act compliance status
  - ISO/IEC 42001 alignment
  - NIST AI RMF adherence
  - Visual progress bars

**Example Remediation Steps**:
1. **Bias Mitigation** (High Priority)
   - Balance training data across demographic categories
   - Impact: 15-20 point improvement
   - Timeline: 2-3 weeks

2. **Safety Enhancement** (Critical Priority)
   - Add content filtering for toxic outputs
   - Impact: 80% reduction in harmful content
   - Timeline: 1-2 weeks

3. **Model Improvement** (Medium Priority)
   - Retrain with diverse, balanced dataset
   - Impact: 20-30 point overall improvement
   - Timeline: 4-6 weeks

**Visual Design**:
- Priority-based color coding
- Card layout with detailed information
- Progress bars for compliance status

### 5. Export Options
**Purpose**: Share and distribute audit results

**Components**:
- **Download PDF**: 
  - Professional, printable report
  - Includes all sections and visualizations
  - Stakeholder-ready format
  
- **Share Audit**:
  - Unique shareable link
  - QR code generation (planned)
  - Regulatory body submission ready

**Visual Design**:
- Action buttons in header
- Modal dialog for sharing
- Copy-to-clipboard functionality

## Technical Implementation

### Component Structure
```
ReportPage.jsx
├── Executive Summary Section
│   ├── TrustScoreGauge (reused component)
│   ├── Audit Status Badge
│   └── Metadata Display
├── AI Nutrition Label Section
│   ├── Data Ingredients List
│   └── Risk Factors Summary
├── Deep-Dive Analysis Section
│   ├── BiasBreakdownChart (reused component)
│   ├── Safety Metrics Cards
│   └── Granite Insights Cards
├── Remediation Roadmap Section
│   ├── Remediation Steps Grid
│   └── Compliance Checklist
└── Export Options
    ├── PDF Export Button
    └── Share Modal
```

### Props Interface
```javascript
{
  scanResults: {
    score: number,              // 0-100 trust score
    riskLevel: string,          // 'green' | 'yellow' | 'red'
    timestamp: string,          // ISO timestamp
    modelName: string,          // Model identifier
    biasAnalysis: {
      score: number,
      reasoning: string,
      breakdown: Array
    },
    safetyAnalysis: {
      score: number,
      reasoning: string
    },
    dataIngredients: Array,
    riskFactors: Array,
    biasBreakdown: Array
  },
  onBack: function              // Navigation callback
}
```

### State Management
- `showShareModal`: Controls share dialog visibility
- `shareLink`: Generated unique report URL
- `isGeneratingPDF`: Loading state for PDF generation

### Key Functions

#### `getAuditStatus(score)`
Determines audit status based on score:
- Returns: `{ label, type, icon }`
- Used for status badge rendering

#### `getComplianceStatus(score)`
Calculates compliance with regulatory standards:
- Returns: Array of compliance objects
- Each with: `{ standard, status, color }`

#### `getRemediationSteps(score, results)`
Generates actionable improvement steps:
- Returns: Array of remediation objects
- Each with: `{ priority, category, action, impact, timeline }`

#### `getGraniteInsights(results)`
Extracts AI-generated insights:
- Returns: Array of insight objects
- Each with: `{ category, insight, confidence }`

#### `handleExportPDF()`
Generates and downloads PDF report:
- Simulates 2-second generation
- In production: calls backend API
- Creates download link

#### `handleShare()`
Opens share modal with unique link:
- Generates unique report ID
- Provides copy-to-clipboard functionality
- QR code generation (planned)

## Styling

### CSS Architecture
- **File**: `ReportPage.css`
- **Design System**: Carbon Design System + Custom
- **Color Palette**:
  - Background: `#161616` (Dark)
  - Cards: `#262626` (Medium Dark)
  - Borders: `#393939` (Gray)
  - Primary: `#0f62fe` (IBM Blue)
  - Success: `#24a148` (Green)
  - Warning: `#f1c21b` (Yellow)
  - Error: `#da1e28` (Red)

### Key Style Classes
- `.report-page`: Main container
- `.report-section`: Section wrapper
- `.executive-summary`: Hero section
- `.nutrition-section`: Nutrition label
- `.analysis-section`: Deep-dive analysis
- `.remediation-section`: Roadmap section
- `.audit-status-badge`: Status indicator
- `.remediation-card`: Action item card
- `.compliance-card`: Compliance status card

### Responsive Breakpoints
- **Desktop**: > 1056px (full layout)
- **Tablet**: 672px - 1056px (2-column grid)
- **Mobile**: < 672px (single column)

### Animations
- Fade-in on mount
- Slide-up transitions
- Hover effects on cards
- Scale animations on buttons

## Integration with Dashboard

### Navigation Flow
1. User completes scan on Dashboard
2. "View Full Report" button appears in hero section
3. Click triggers `handleViewReport()`
4. Dashboard conditionally renders ReportPage
5. ReportPage receives `scanResults` prop
6. Back button returns to Dashboard

### Code Example
```javascript
// In Dashboard.jsx
const [showReport, setShowReport] = useState(false);

const handleViewReport = () => {
  if (scanResults) {
    setShowReport(true);
  }
};

if (showReport && scanResults) {
  return <ReportPage scanResults={scanResults} onBack={handleBackFromReport} />;
}
```

## Usage Examples

### Basic Usage
```javascript
import ReportPage from './components/ReportPage';

function App() {
  const [scanResults, setScanResults] = useState(null);
  
  return (
    <ReportPage 
      scanResults={scanResults}
      onBack={() => console.log('Back clicked')}
    />
  );
}
```

### With Navigation
```javascript
const [currentView, setCurrentView] = useState('dashboard');

{currentView === 'report' ? (
  <ReportPage 
    scanResults={scanResults}
    onBack={() => setCurrentView('dashboard')}
  />
) : (
  <Dashboard onViewReport={() => setCurrentView('report')} />
)}
```

## Future Enhancements

### Planned Features
1. **PDF Generation Backend**
   - Server-side PDF rendering
   - Custom branding options
   - Multi-page layout

2. **QR Code Generation**
   - Real QR code for sharing
   - Mobile-friendly scanning
   - Embedded report metadata

3. **Report History**
   - Save multiple reports
   - Compare across audits
   - Trend analysis

4. **Custom Branding**
   - Logo upload
   - Color scheme customization
   - Company information

5. **Advanced Export**
   - Excel/CSV data export
   - JSON API response
   - Email delivery

6. **Collaboration Features**
   - Comments and annotations
   - Team sharing
   - Approval workflows

## Best Practices

### Performance
- Lazy load charts
- Memoize expensive calculations
- Optimize re-renders with React.memo
- Use virtual scrolling for long lists

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Security
- Sanitize user input
- Validate report data
- Secure share links with expiration
- Rate limit PDF generation

### Testing
- Unit tests for utility functions
- Integration tests for user flows
- Visual regression tests
- Performance benchmarks

## Troubleshooting

### Common Issues

**Issue**: Report not displaying
- **Solution**: Ensure `scanResults` prop is not null
- **Check**: Console for prop validation errors

**Issue**: Charts not rendering
- **Solution**: Verify chart data format
- **Check**: BiasBreakdownChart component props

**Issue**: PDF export not working
- **Solution**: Implement backend PDF generation
- **Check**: Network tab for API errors

**Issue**: Share link not copying
- **Solution**: Check clipboard API permissions
- **Check**: Browser compatibility

## Support

For issues or questions:
- Check component documentation
- Review error logs in console
- Test with sample data
- Contact development team

---

**Made with Bob** - EthosEngine Report Page v1.0