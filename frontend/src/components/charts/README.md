# Data Visualization Charts - EthosEngine

This directory contains the data visualization components for the EthosEngine dashboard, implementing **Priority #3, Task 3** from the 24-hour hackathon plan.

## 📊 Components Overview

### 1. BiasBreakdownChart
**File**: `BiasBreakdownChart.jsx`

A bar chart that displays the breakdown of different bias types detected in AI model analysis.

**Features**:
- Color-coded bars based on severity (Red/Orange/Yellow/Green)
- Responsive design with IBM Carbon Charts
- Empty state handling
- Custom legend with severity levels

**Props**:
```javascript
{
  biasData: [
    { type: 'Demographic', percentage: 25 },
    { type: 'Gender', percentage: 15 },
    { type: 'Age', percentage: 10 },
    { type: 'Geographic', percentage: 8 }
  ]
}
```

**Color Scheme**:
- Critical (70-100%): Red (#da1e28)
- High (40-69%): Orange (#ff832b)
- Medium (20-39%): Yellow (#f1c21b)
- Low (0-19%): Green (#24a148)

---

### 2. AuditHistoryTimeline
**File**: `AuditHistoryTimeline.jsx`

A line chart showing the history of trust scores over time, helping visualize trends and patterns.

**Features**:
- Time-series visualization
- Color-coded zones (Red/Yellow/Green)
- Interactive tooltips
- Statistics summary (Total Audits, Latest Score, Average)
- Zoom bar for large datasets (>10 audits)

**Props**:
```javascript
{
  auditHistory: [
    { timestamp: '2026-05-02T10:30:00Z', trustScore: 78 },
    { timestamp: '2026-05-02T11:45:00Z', trustScore: 82 },
    { timestamp: '2026-05-02T13:20:00Z', trustScore: 75 }
  ]
}
```

**Trust Score Zones**:
- Critical: 0-40 (Red)
- Warning: 41-70 (Yellow)
- Safe: 71-100 (Green)

---

### 3. RiskFactorBreakdown
**File**: `RiskFactorBreakdown.jsx`

A donut chart displaying the distribution of risk factors across different severity levels.

**Features**:
- Color-coded segments by severity
- Interactive tooltips
- Center label showing total risks
- Summary grid with individual risk counts
- Responsive legend

**Props**:
```javascript
{
  riskFactors: [
    { category: 'Critical', count: 3 },
    { category: 'High', count: 5 },
    { category: 'Medium', count: 2 },
    { category: 'Low', count: 1 }
  ]
}
```

**Severity Colors**:
- Critical: Red (#da1e28)
- High: Orange (#ff832b)
- Medium: Yellow (#f1c21b)
- Low: Green (#24a148)
- Minimal: Blue (#0f62fe)

---

## 🎨 Design System

All charts follow the **IBM Carbon Design System** guidelines:

- **Theme**: g100 (dark theme)
- **Typography**: IBM Plex Sans
- **Spacing**: 8px base grid
- **Colors**: IBM Carbon color palette
- **Accessibility**: WCAG AA compliant

---

## 🔌 Integration

### Dashboard Integration

The charts are integrated into the Dashboard component:

```javascript
import BiasBreakdownChart from './charts/BiasBreakdownChart';
import AuditHistoryTimeline from './charts/AuditHistoryTimeline';
import RiskFactorBreakdown from './charts/RiskFactorBreakdown';

// State management
const [chartData, setChartData] = useState({
  biasBreakdown: [],
  auditHistory: [],
  riskFactors: []
});

// Update on scan completion
const handleScanComplete = (results) => {
  setChartData(prev => ({
    biasBreakdown: results.biasAnalysis?.breakdown || [],
    auditHistory: [...prev.auditHistory, {
      timestamp: results.timestamp,
      trustScore: results.score
    }],
    riskFactors: results.riskFactors || []
  }));
};

// Render in Grid
<Column lg={8} md={4} sm={4}>
  <BiasBreakdownChart biasData={chartData.biasBreakdown} />
</Column>
<Column lg={8} md={4} sm={4}>
  <RiskFactorBreakdown riskFactors={chartData.riskFactors} />
</Column>
<Column lg={16} md={8} sm={4}>
  <AuditHistoryTimeline auditHistory={chartData.auditHistory} />
</Column>
```

---

## 📦 Dependencies

All charts use **@carbon/charts-react** which is already installed:

```json
{
  "@carbon/charts": "^1.27.8",
  "@carbon/charts-react": "^1.27.8"
}
```

**Required Imports**:
```javascript
import { BarChartSimple } from '@carbon/charts-react';
import { LineChart } from '@carbon/charts-react';
import { DonutChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
```

---

## 🎯 Data Flow

```
User Clicks Scan Button
        ↓
API Call to Backend
        ↓
Scan Results Returned
        ↓
handleScanComplete(results)
        ↓
Update chartData State
        ↓
Charts Re-render with New Data
```

---

## 🧪 Testing

### Empty State Testing
All charts handle empty data gracefully:
- Display informative empty state messages
- Maintain layout structure
- Show clear call-to-action

### Mock Data Testing
Charts work with mock data for development:
```javascript
// Mock bias data
const mockBiasData = [
  { type: 'Demographic', percentage: 25 },
  { type: 'Gender', percentage: 15 },
  { type: 'Age', percentage: 10 }
];

// Mock audit history
const mockAuditHistory = [
  { timestamp: new Date().toISOString(), trustScore: 78 }
];

// Mock risk factors
const mockRiskFactors = [
  { category: 'Critical', count: 2 },
  { category: 'High', count: 3 }
];
```

---

## 📱 Responsive Design

All charts are fully responsive:

- **Desktop (lg)**: Full-width charts with detailed legends
- **Tablet (md)**: Adjusted layouts, maintained functionality
- **Mobile (sm)**: Stacked layouts, simplified legends

**Breakpoints**:
- Large: 1056px+
- Medium: 672px - 1055px
- Small: < 672px

---

## ♿ Accessibility

Charts follow WCAG AA guidelines:

- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Indicators**: Clear focus states

---

## 🚀 Performance

**Optimization Strategies**:
- Lazy loading for large datasets
- Efficient re-rendering with React hooks
- Memoization of chart options
- Debounced updates for real-time data

---

## 📝 Future Enhancements

Potential improvements for post-hackathon:

1. **Export Functionality**: Download charts as PNG/SVG
2. **Date Range Filters**: Filter audit history by date
3. **Drill-Down Views**: Click to see detailed breakdowns
4. **Comparison Mode**: Compare multiple audits side-by-side
5. **Real-Time Updates**: WebSocket integration for live data
6. **Custom Themes**: User-selectable color schemes
7. **Advanced Analytics**: Trend predictions and insights

---

## 🐛 Troubleshooting

### Charts Not Displaying
- Verify `@carbon/charts-react` is installed
- Check that CSS is imported: `import '@carbon/charts-react/styles.css'`
- Ensure data format matches expected structure

### Empty State Always Showing
- Verify data is being passed correctly to props
- Check console for data structure errors
- Ensure state updates are triggering re-renders

### Styling Issues
- Confirm Carbon theme is applied to parent
- Check for CSS conflicts with custom styles
- Verify responsive breakpoints are working

---

## 📚 Resources

- [Carbon Charts Documentation](https://charts.carbondesignsystem.com/)
- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [React Charts Best Practices](https://react-charts.js.org/)

---

## ✅ Completion Status

**Priority #3, Task 3: Data Visualization** - ✅ COMPLETE

- [x] BiasBreakdownChart component
- [x] AuditHistoryTimeline component
- [x] RiskFactorBreakdown component
- [x] Dashboard integration
- [x] Responsive styling
- [x] Empty state handling
- [x] Documentation

---

**Created**: 2026-05-02  
**Author**: Bob  
**Version**: 1.0.0  
**Status**: Production Ready