# Trust Score Gauge Component

## Overview
The **Trust Score Gauge** is a hero component that displays AI model trust scores using an animated circular gauge with semantic color coding. It follows the IBM Carbon Design System and EthosEngine UI guidelines.

## Features

### Visual Design
- **Animated Circular Gauge**: Smooth 1.5-second animation on mount
- **Semantic Color Coding**:
  - 🟢 **Green (71-100)**: High Trust / Safe
  - 🟡 **Yellow (41-70)**: Medium Risk / Needs Attention
  - 🔴 **Red (0-40)**: High Risk / Critical Issues
- **Professional Flat Design**: 0px border radius, minimal shadows
- **8px Base Grid**: Consistent spacing throughout

### Component States
1. **Loading State**: Shows Carbon loading spinner with descriptive text
2. **Active State**: Displays animated gauge with score and breakdown
3. **Empty State**: Shows placeholder when no data is available

### Accessibility
- WCAG AA compliant color contrast
- High-visibility focus states
- Semantic HTML structure
- Screen reader friendly

## Usage

### Basic Usage
```jsx
import TrustScoreGauge from './components/TrustScoreGauge';

function Dashboard() {
  return (
    <TrustScoreGauge 
      score={78}
      loading={false}
      riskLevel={null}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `score` | `number \| null` | `null` | Trust score value (0-100). `null` shows empty state |
| `loading` | `boolean` | `false` | Shows loading spinner when `true` |
| `riskLevel` | `string \| null` | `null` | Override auto-calculated risk level ('green', 'yellow', 'red') |

### Examples

#### High Trust Score (Green)
```jsx
<TrustScoreGauge score={85} />
```

#### Medium Risk Score (Yellow)
```jsx
<TrustScoreGauge score={55} />
```

#### High Risk Score (Red)
```jsx
<TrustScoreGauge score={35} />
```

#### Loading State
```jsx
<TrustScoreGauge loading={true} />
```

#### Empty State
```jsx
<TrustScoreGauge score={null} />
```

## Component Structure

```
TrustScoreGauge
├── Header Section
│   ├── Title: "Trust Score"
│   └── Subtitle: "Real-time AI integrity assessment"
├── Gauge Container
│   ├── SVG Circular Gauge (280x280px)
│   │   ├── Background Circle (gray)
│   │   ├── Animated Progress Circle (colored)
│   │   └── Center Score Display
│   ├── Risk Level Indicator
│   │   ├── Icon (Checkmark/Warning/Error)
│   │   └── Status Tag
│   └── Score Breakdown
│       ├── Bias Detection
│       ├── Safety Score
│       └── Compliance Status
└── Score Range Legend
    ├── 71-100: High Trust (Green)
    ├── 41-70: Medium Risk (Yellow)
    └── 0-40: High Risk (Red)
```

## Styling

### CSS Classes
- `.trust-score-gauge` - Main container
- `.gauge-header` - Header section
- `.gauge-container` - Gauge display area
- `.gauge-svg` - SVG element
- `.gauge-score` - Center score text
- `.gauge-risk-indicator` - Risk level display
- `.gauge-breakdown` - Score breakdown section
- `.gauge-legend` - Color legend

### Customization
The component follows strict UI guidelines but can be customized via CSS variables:

```css
.trust-score-gauge {
  --gauge-size: 280px;
  --gauge-stroke-width: 24px;
  --animation-duration: 1.5s;
}
```

## Animation Details

### Score Animation
- **Duration**: 1.5 seconds
- **Easing**: Linear (60 steps)
- **Trigger**: Component mount or score change
- **Effect**: Smooth counting from 0 to target score

### Visual Effects
- Subtle pulse animation on progress circle
- Smooth color transitions
- Drop shadow on active gauge

## Responsive Behavior

### Desktop (>672px)
- Full size gauge (280x280px)
- Large score display (56px)
- Horizontal layout

### Tablet (672px - 480px)
- Medium gauge (240x240px)
- Medium score display (48px)
- Maintained layout

### Mobile (<480px)
- Small gauge (200x200px)
- Small score display (40px)
- Vertical risk indicator layout

## Integration with Dashboard

The Trust Score Gauge is designed as the **hero element** of the dashboard:

```jsx
<Column lg={10} md={6} sm={4} className="dashboard-main-section">
  <TrustScoreGauge 
    score={trustScoreData.score}
    loading={trustScoreData.loading}
    riskLevel={trustScoreData.riskLevel}
  />
</Column>
```

## Performance Considerations

- **Lightweight**: Pure CSS animations, no heavy libraries
- **Optimized**: Uses CSS transforms for smooth 60fps animations
- **Efficient**: Minimal re-renders with proper React hooks
- **Accessible**: No animation for users with `prefers-reduced-motion`

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern CSS features)

## Future Enhancements

Potential improvements for future iterations:
- [ ] Historical trend line
- [ ] Comparison with industry benchmarks
- [ ] Downloadable gauge as image
- [ ] Customizable score ranges
- [ ] Multiple gauge sizes (sm, md, lg)
- [ ] Dark/light theme toggle

## Related Components

- **NutritionLabel**: Displays detailed AI model information
- **ScanButton**: Triggers AI model analysis
- **Dashboard**: Main container for all components

## Design Guidelines Reference

This component strictly follows:
- `Documentation/ui_design_guidelines.md`
- `Documentation/24hr_hackathon_plan.md` (Task 4)
- IBM Carbon Design System principles

## Credits

Built with:
- React 18
- IBM Carbon Design System
- IBM Plex Sans typography
- SVG for gauge visualization

---

**Made with Bob** | EthosEngine - AI Integrity Sentinel