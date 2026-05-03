# Report Page - Quick Start Guide

## Overview
The Report Page is a comprehensive audit report that displays detailed AI model analysis results with actionable insights and export capabilities.

## Features at a Glance

### 📊 Executive Summary
- **Trust Score Gauge**: Large circular gauge (0-100)
- **Audit Status**: Passed/Caution/Failed badge
- **Metadata**: Timestamp, model version, scan type

### 🏷️ AI Nutrition Label
- **Data Ingredients**: List of data sources
- **Risk Factors**: Critical safety and bias concerns

### 🔍 Deep-Dive Analysis
- **Bias Breakdown**: Demographic, gender, age, geographic bias charts
- **Safety Metrics**: Toxicity, PII leakage, hate speech detection
- **Granite Insights**: AI-generated explanations from IBM Granite Guardian

### 🛠️ Remediation Roadmap
- **Fix Suggestions**: Prioritized action items with timelines
- **Compliance Checklist**: EU AI Act, ISO/IEC 42001, NIST AI RMF status

### 📤 Export Options
- **PDF Download**: Professional printable report
- **Share Link**: Unique URL for stakeholders

## Quick Start

### 1. Navigate to Report
After completing a scan on the Dashboard, click the **"View Full Report"** button in the hero section.

### 2. Review Sections
Scroll through the report to review:
- Overall trust score and status
- Detailed bias and safety analysis
- Actionable remediation steps
- Regulatory compliance status

### 3. Export Report
- Click **"Export PDF"** to download a printable version
- Click **"Share Report"** to get a shareable link

### 4. Return to Dashboard
Click the **"Back to Dashboard"** button to return to the main view.

## Usage Example

```javascript
import ReportPage from './components/ReportPage';

function App() {
  const scanResults = {
    score: 75,
    riskLevel: 'green',
    timestamp: '2026-05-03T08:00:00Z',
    modelName: 'GPT-4',
    biasAnalysis: {
      score: 25,
      reasoning: 'Low bias detected across categories'
    },
    safetyAnalysis: {
      score: 20,
      reasoning: 'Minimal safety concerns identified'
    },
    dataIngredients: ['Public Datasets', 'Synthetic Data'],
    riskFactors: []
  };

  return (
    <ReportPage 
      scanResults={scanResults}
      onBack={() => console.log('Back clicked')}
    />
  );
}
```

## Score Interpretation

### Trust Score Ranges
- **71-100 (Green)**: High Trust - Model passed audit
- **41-70 (Yellow)**: Medium Risk - Review required
- **0-40 (Red)**: High Risk - Model failed audit

### Audit Status
- **Passed**: Score ≥ 71, compliant with regulations
- **Caution**: Score 41-70, review and improvements needed
- **Failed**: Score ≤ 40, significant issues detected

## Remediation Priority Levels

### Critical (Red)
- Immediate action required
- Blocks production deployment
- Timeline: 1-2 weeks

### High (Magenta)
- Important improvements needed
- Affects compliance
- Timeline: 2-3 weeks

### Medium (Blue)
- Recommended enhancements
- Improves overall quality
- Timeline: 4-6 weeks

## Compliance Standards

### EU AI Act
- High-risk AI system requirements
- Transparency obligations
- Risk management framework

### ISO/IEC 42001
- AI management system standard
- Governance and accountability
- Continuous improvement

### NIST AI RMF
- Risk management framework
- Trustworthy AI characteristics
- Lifecycle management

## Export Formats

### PDF Report
- Professional layout
- All sections included
- Print-ready format
- Stakeholder-friendly

### Share Link
- Unique URL per report
- Secure access
- Regulatory submission ready
- QR code (coming soon)

## Keyboard Shortcuts

- **Esc**: Close share modal
- **Ctrl/Cmd + P**: Print report (browser print)
- **Ctrl/Cmd + S**: Save page (browser save)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Report Not Loading
- Ensure scan completed successfully
- Check browser console for errors
- Verify scanResults prop is valid

### Charts Not Displaying
- Check data format in scanResults
- Ensure Chart.js is loaded
- Verify browser compatibility

### PDF Export Not Working
- Backend PDF generation required
- Check network connectivity
- Verify API endpoint

### Share Link Not Copying
- Enable clipboard permissions
- Use modern browser
- Try manual copy

## Best Practices

### For Developers
1. Always validate scanResults before rendering
2. Handle loading and error states
3. Optimize chart rendering performance
4. Test on multiple screen sizes

### For Users
1. Review all sections thoroughly
2. Download PDF for records
3. Share link with stakeholders
4. Follow remediation roadmap

### For Stakeholders
1. Focus on Executive Summary first
2. Review compliance checklist
3. Prioritize critical remediation items
4. Schedule follow-up audits

## Related Components

- **Dashboard**: Main application view
- **TrustScoreGauge**: Circular score display
- **BiasBreakdownChart**: Bias visualization
- **NutritionLabel**: Model transparency card

## API Integration

The Report Page uses data from the scan API:

```javascript
// Scan API Response Structure
{
  "success": true,
  "data": {
    "score": 75,
    "riskLevel": "green",
    "biasAnalysis": { ... },
    "safetyAnalysis": { ... },
    "timestamp": "2026-05-03T08:00:00Z"
  }
}
```

## Customization

### Branding
Modify colors in `ReportPage.css`:
```css
.report-section {
  border-color: #YOUR_BRAND_COLOR;
}
```

### Content
Update text in `ReportPage.jsx`:
```javascript
const complianceStandards = [
  'Your Custom Standard',
  'Another Standard'
];
```

## Performance Tips

1. **Lazy Load Charts**: Load charts only when visible
2. **Memoize Calculations**: Use React.memo for expensive operations
3. **Optimize Images**: Compress logos and icons
4. **Code Splitting**: Separate report bundle from main app

## Security Considerations

1. **Sanitize Data**: Clean all user input
2. **Validate Props**: Check scanResults structure
3. **Secure Links**: Use expiring share URLs
4. **Rate Limiting**: Limit PDF generation requests

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus indicators visible

## Mobile Responsiveness

- Single column layout on mobile
- Touch-friendly buttons
- Readable font sizes
- Optimized chart sizes

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Report versioning
- [ ] Custom templates
- [ ] Advanced filtering
- [ ] Batch exports
- [ ] Email delivery
- [ ] API webhooks

## Support

For help or questions:
- Check full documentation: `REPORT_PAGE_DOCUMENTATION.md`
- Review component code: `ReportPage.jsx`
- Test with sample data
- Contact development team

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-03  
**Made with Bob** - EthosEngine