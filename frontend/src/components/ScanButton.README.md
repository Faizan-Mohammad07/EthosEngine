# Scan Button Component

## Overview
The **Scan Button** is a call-to-action component that triggers AI model audits with a modal input form, progressive loading states, and simulated API calls. It follows the IBM Carbon Design System and EthosEngine UI guidelines.

## Features

### Visual Design
- **Primary Blue Button**: Clear call-to-action using IBM Carbon primary button
- **Modal Input Form**: Professional form for model details
- **Progressive Loading**: 7-step scanning animation with descriptive messages
- **Pulse Animation**: Visual feedback during scanning
- **Quick Stats Cards**: Display scan metrics

### Component States
1. **Idle State**: Shows "Scan AI Model" button with hint text and stats
2. **Modal State**: Input form for model name and description
3. **Scanning State**: Progressive loading with animated pulses
4. **Complete State**: Returns to idle with updated results

### User Flow
```
Click Button → Modal Opens → Enter Details → Start Scan → 
Progressive Loading (7 steps) → Results Generated → 
Dashboard Updated → Return to Idle
```

## Usage

### Basic Usage
```jsx
import ScanButton from './components/ScanButton';

function Dashboard() {
  const handleScanStart = () => {
    console.log('Scan started');
  };

  const handleScanComplete = (results) => {
    console.log('Scan complete:', results);
  };

  return (
    <ScanButton 
      onScanStart={handleScanStart}
      onScanComplete={handleScanComplete}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onScanStart` | `function` | No | Callback when scan begins (for loading states) |
| `onScanComplete` | `function` | No | Callback with results when scan completes |

### Callback Parameters

#### onScanComplete Results Object
```javascript
{
  score: 78,              // Trust score (0-100)
  modelName: "HR AI",     // User-provided model name
  timestamp: "2026-05-02T10:20:00Z",
  riskLevel: "yellow"     // 'green', 'yellow', or 'red'
}
```

## Component Structure

```
ScanButton
├── Idle State
│   ├── Primary Button ("Scan AI Model")
│   ├── Hint Text
│   └── Quick Stats Cards
│       ├── Avg Scan Time (~5s)
│       ├── Audit Checks (7)
│       └── IBM Powered (100%)
├── Modal (Input Form)
│   ├── Model Name (Required)
│   ├── Model Description (Optional)
│   └── Info Banner
└── Scanning State
    ├── Loading Indicator
    ├── Progress Message
    └── Pulse Animation (3 circles)
```

## Scanning Process

### 7-Step Progressive Loading
1. **Initializing AI model analysis...** (800ms)
2. **Scanning for demographic bias...** (1200ms)
3. **Analyzing safety protocols...** (1000ms)
4. **Checking toxicity levels...** (900ms)
5. **Evaluating fairness metrics...** (1100ms)
6. **Generating trust score...** (800ms)
7. **Finalizing audit report...** (600ms)

**Total Duration**: ~5.4 seconds

### Score Generation Algorithm
The component generates realistic mock scores based on:
- **Base Score**: 50 points
- **Description Length Bonus**: Up to 30 points (1 point per 20 characters)
- **Random Variation**: ±10 points
- **Final Range**: 0-100 (clamped)

Example:
```javascript
// Short description (50 chars) = 50 + 2 + random(-10 to +10) = 42-62
// Long description (600 chars) = 50 + 30 + random(-10 to +10) = 70-90
```

## Styling

### CSS Classes
- `.scan-button-container` - Main container
- `.scan-button-wrapper` - Button wrapper
- `.scan-button` - Primary action button
- `.scan-button-hint` - Hint text below button
- `.scanning-state` - Loading state container
- `.scan-pulse` - Animated pulse circles
- `.scan-modal` - Modal overlay
- `.scan-stats` - Quick stats grid
- `.stat-card` - Individual stat card

### Animations

#### Pulse Animation
```css
@keyframes pulse-animation {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
```
- **Duration**: 2 seconds
- **Timing**: ease-out
- **Infinite**: Yes
- **Staggered**: 3 circles with 0.5s delay

#### Button Hover Effect
- **Transform**: translateY(-2px)
- **Shadow**: 0 4px 8px rgba(15, 98, 254, 0.3)
- **Transition**: 0.2s ease

## Integration Example

### Full Dashboard Integration
```jsx
function Dashboard() {
  const [trustScoreData, setTrustScoreData] = useState({
    score: null,
    loading: false,
    riskLevel: null,
  });

  const handleScanStart = () => {
    setTrustScoreData({
      score: null,
      loading: true,
      riskLevel: null,
    });
  };

  const handleScanComplete = (results) => {
    setTrustScoreData({
      score: results.score,
      loading: false,
      riskLevel: results.riskLevel,
    });
  };

  return (
    <>
      <TrustScoreGauge 
        score={trustScoreData.score}
        loading={trustScoreData.loading}
      />
      <ScanButton 
        onScanStart={handleScanStart}
        onScanComplete={handleScanComplete}
      />
    </>
  );
}
```

## Modal Form Validation

### Required Fields
- **Model Name**: Must not be empty (trimmed)

### Optional Fields
- **Model Description**: Affects score generation

### Validation States
- Primary button disabled when form invalid
- Real-time validation on input change
- Clear error states (handled by Carbon components)

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit form
- Escape to close modal
- Focus management on modal open/close

### Screen Readers
- Descriptive button labels
- ARIA labels on all inputs
- Loading state announcements
- Progress updates during scan

### Color Contrast
- WCAG AA compliant
- High contrast text (#ffffff on #0f62fe)
- Sufficient contrast for all states

## Responsive Behavior

### Desktop (>672px)
- Button: 240px min-width, 56px height
- Stats: 3-column grid
- Full modal width

### Mobile (<672px)
- Button: 200px min-width, 48px height
- Stats: Single column
- Reduced padding and spacing

## Performance Considerations

- **Lightweight**: No heavy dependencies
- **Optimized**: Efficient state management
- **Smooth**: CSS animations (60fps)
- **Async**: Non-blocking scan simulation

## Future Enhancements

Potential improvements:
- [ ] Real IBM Granite Guardian API integration
- [ ] File upload for model artifacts
- [ ] Batch scanning multiple models
- [ ] Scan history and comparison
- [ ] Export scan results as PDF
- [ ] Advanced configuration options
- [ ] Real-time progress bar
- [ ] Pause/resume scanning

## Error Handling

### Current Implementation
- Form validation prevents invalid submissions
- Modal can be cancelled at any time
- Scan cannot be interrupted (by design for demo)

### Future Error States
- API connection errors
- Timeout handling
- Retry mechanisms
- Error notifications

## Testing Scenarios

### Test Cases
1. **Empty Form**: Button should be disabled
2. **Valid Form**: Should trigger scan
3. **Short Description**: Lower score (40-60)
4. **Long Description**: Higher score (70-90)
5. **Multiple Scans**: Stats should accumulate
6. **Modal Cancel**: Should not trigger scan

### Example Test
```javascript
// Test: Long description generates high score
const input = {
  modelName: "Test Model",
  modelDescription: "A".repeat(600) // 600 characters
};
// Expected: Score between 70-90
```

## Related Components

- **TrustScoreGauge**: Displays scan results
- **NutritionLabel**: Shows detailed model info
- **Dashboard**: Main container and state manager

## Design Guidelines Reference

This component strictly follows:
- `Documentation/ui_design_guidelines.md`
- `Documentation/24hr_hackathon_plan.md` (Task 5)
- IBM Carbon Design System principles

## IBM Carbon Components Used

- `Button` - Primary action button
- `TextInput` - Model name input
- `TextArea` - Model description input
- `Modal` - Input form overlay
- `InlineLoading` - Scanning progress indicator

## Credits

Built with:
- React 18
- IBM Carbon Design System
- IBM Carbon Icons
- IBM Plex Sans typography

---

**Made with Bob** | EthosEngine - AI Integrity Sentinel