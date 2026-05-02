import { useEffect, useState } from 'react';
import { 
  Loading,
  Tag,
} from '@carbon/react';
import {
  CheckmarkFilled,
  WarningAltFilled,
  ErrorFilled,
} from '@carbon/icons-react';
import './TrustScoreGauge.css';

/**
 * Trust Score Gauge Component
 * Animated circular gauge with Red/Yellow/Green color coding
 * Following UI Design Guidelines:
 * - Score ranges: 0-40 (Red), 41-70 (Yellow), 71-100 (Green)
 * - Smooth animation on component mount
 * - Large circular gauge as hero element
 * - Semantic colors per guidelines: #da1e28 (Red), #f1c21b (Yellow), #24a148 (Green)
 */
function TrustScoreGauge({ score = null, loading = false, riskLevel = null }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine risk level based on score
  const getRiskLevel = (scoreValue) => {
    if (scoreValue >= 71) return 'green';
    if (scoreValue >= 41) return 'yellow';
    return 'red';
  };

  // Get color based on risk level
  const getRiskColor = (level) => {
    switch (level) {
      case 'green':
        return '#24a148'; // Green (Safe) per guidelines
      case 'yellow':
        return '#f1c21b'; // Yellow (Caution) per guidelines
      case 'red':
        return '#da1e28'; // Red (Critical) per guidelines
      default:
        return '#8d8d8d'; // Gray for no data
    }
  };

  // Get risk label
  const getRiskLabel = (level) => {
    switch (level) {
      case 'green':
        return 'High Trust';
      case 'yellow':
        return 'Medium Risk';
      case 'red':
        return 'High Risk';
      default:
        return 'No Data';
    }
  };

  // Get risk icon
  const getRiskIcon = (level) => {
    switch (level) {
      case 'green':
        return <CheckmarkFilled size={24} />;
      case 'yellow':
        return <WarningAltFilled size={24} />;
      case 'red':
        return <ErrorFilled size={24} />;
      default:
        return null;
    }
  };

  // Animate score on mount or when score changes
  useEffect(() => {
    if (score !== null && !loading) {
      setIsAnimating(true);
      const duration = 1500; // 1.5 seconds animation
      const steps = 60;
      const increment = score / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedScore(Math.min(Math.round(increment * currentStep), score));

        if (currentStep >= steps) {
          clearInterval(timer);
          setIsAnimating(false);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else if (score === null) {
      setAnimatedScore(0);
    }
  }, [score, loading]);

  const currentRiskLevel = riskLevel || getRiskLevel(animatedScore);
  const currentColor = getRiskColor(currentRiskLevel);
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="trust-score-gauge">
      {/* Header Section */}
      <div className="gauge-header">
        <h3 className="gauge-title">Trust Score</h3>
        <p className="gauge-subtitle">
          Real-time AI integrity assessment
        </p>
      </div>

      {/* Gauge Container */}
      <div className="gauge-container">
        {loading ? (
          <div className="gauge-loading">
            <Loading description="Analyzing AI model..." withOverlay={false} />
            <p className="loading-text">Scanning for bias and safety issues...</p>
          </div>
        ) : score !== null ? (
          <>
            {/* SVG Circular Gauge */}
            <svg className="gauge-svg" viewBox="0 0 280 280">
              {/* Background Circle */}
              <circle
                className="gauge-background"
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="#393939"
                strokeWidth="24"
              />
              
              {/* Animated Progress Circle */}
              <circle
                className="gauge-progress"
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke={currentColor}
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 140 140)"
                style={{
                  transition: isAnimating ? 'stroke-dashoffset 0.025s linear' : 'stroke-dashoffset 0.3s ease',
                }}
              />

              {/* Center Content */}
              <g className="gauge-center">
                {/* Score Value */}
                <text
                  x="140"
                  y="130"
                  textAnchor="middle"
                  className="gauge-score"
                  fill="#ffffff"
                >
                  {animatedScore}
                </text>
                
                {/* Score Label */}
                <text
                  x="140"
                  y="160"
                  textAnchor="middle"
                  className="gauge-score-label"
                  fill="#c6c6c6"
                >
                  / 100
                </text>
              </g>
            </svg>

            {/* Risk Level Indicator */}
            <div className="gauge-risk-indicator">
              <div className="risk-icon" style={{ color: currentColor }}>
                {getRiskIcon(currentRiskLevel)}
              </div>
              <Tag
                type={currentRiskLevel}
                size="md"
                className="risk-tag"
              >
                {getRiskLabel(currentRiskLevel)}
              </Tag>
            </div>

            {/* Score Breakdown */}
            <div className="gauge-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Bias Detection</span>
                <span className="breakdown-value" style={{ color: currentColor }}>
                  {animatedScore >= 71 ? 'Low' : animatedScore >= 41 ? 'Medium' : 'High'}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Safety Score</span>
                <span className="breakdown-value" style={{ color: currentColor }}>
                  {animatedScore}%
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Compliance</span>
                <span className="breakdown-value" style={{ color: currentColor }}>
                  {animatedScore >= 71 ? 'Passed' : animatedScore >= 41 ? 'Review' : 'Failed'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="gauge-empty">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="#393939" strokeWidth="4" strokeDasharray="8 8" />
                <text x="40" y="48" textAnchor="middle" fill="#8d8d8d" fontSize="16" fontWeight="500">
                  --
                </text>
              </svg>
            </div>
            <p className="empty-text">No audit data available</p>
            <p className="empty-subtext">Click "Scan AI Model" to begin analysis</p>
          </div>
        )}
      </div>

      {/* Score Range Legend */}
      <div className="gauge-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#24a148' }}></div>
          <span className="legend-label">71-100: High Trust</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f1c21b' }}></div>
          <span className="legend-label">41-70: Medium Risk</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#da1e28' }}></div>
          <span className="legend-label">0-40: High Risk</span>
        </div>
      </div>
    </div>
  );
}

export default TrustScoreGauge;

// Made with Bob