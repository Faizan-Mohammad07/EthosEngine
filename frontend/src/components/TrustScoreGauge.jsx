import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loading,
  Tag,
} from '@carbon/react';
import {
  CheckmarkFilled,
  WarningAltFilled,
  ErrorFilled,
} from '@carbon/icons-react';
import { fadeIn, scaleIn, DURATION } from '../utils/animations';
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
      <motion.div
        className="gauge-header"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <h3 className="gauge-title">Trust Score</h3>
        <p className="gauge-subtitle">
          Real-time AI integrity assessment
        </p>
      </motion.div>

      {/* Gauge Container */}
      <div className="gauge-container">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="gauge-loading"
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Loading description="Analyzing AI model..." withOverlay={false} />
              <p className="loading-text">Scanning for bias and safety issues...</p>
            </motion.div>
          ) : score !== null ? (
            <motion.div
              key="gauge"
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
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
                <motion.circle
                  className="gauge-progress"
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke={currentColor}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{
                    strokeDashoffset: strokeDashoffset,
                    stroke: currentColor
                  }}
                  transition={{
                    strokeDashoffset: { duration: 1.5, ease: [0.4, 0.14, 0.3, 1] },
                    stroke: { duration: 0.3 }
                  }}
                  transform="rotate(-90 140 140)"
                />

                {/* Center Content */}
                <g className="gauge-center">
                  {/* Score Value */}
                  <motion.text
                    x="140"
                    y="130"
                    textAnchor="middle"
                    className="gauge-score"
                    fill="#ffffff"
                    key={animatedScore}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    {animatedScore}
                  </motion.text>
                  
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
              <motion.div
                className="gauge-risk-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <motion.div
                  className="risk-icon"
                  style={{ color: currentColor }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  {getRiskIcon(currentRiskLevel)}
                </motion.div>
                <Tag
                  type={currentRiskLevel}
                  size="md"
                  className="risk-tag"
                >
                  {getRiskLabel(currentRiskLevel)}
                </Tag>
              </motion.div>

              {/* Score Breakdown */}
              <motion.div
                className="gauge-breakdown"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 1.2
                    }
                  }
                }}
              >
                <motion.div
                  className="breakdown-item"
                  variants={fadeIn}
                >
                  <span className="breakdown-label">Bias Detection</span>
                  <motion.span
                    className="breakdown-value"
                    style={{ color: currentColor }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    {animatedScore >= 71 ? 'Low' : animatedScore >= 41 ? 'Medium' : 'High'}
                  </motion.span>
                </motion.div>
                <motion.div
                  className="breakdown-item"
                  variants={fadeIn}
                >
                  <span className="breakdown-label">Safety Score</span>
                  <motion.span
                    className="breakdown-value"
                    style={{ color: currentColor }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    {animatedScore}%
                  </motion.span>
                </motion.div>
                <motion.div
                  className="breakdown-item"
                  variants={fadeIn}
                >
                  <span className="breakdown-label">Compliance</span>
                  <motion.span
                    className="breakdown-value"
                    style={{ color: currentColor }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    {animatedScore >= 71 ? 'Passed' : animatedScore >= 41 ? 'Review' : 'Failed'}
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="gauge-empty"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className="empty-icon"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="38" stroke="#393939" strokeWidth="4" strokeDasharray="8 8" />
                  <text x="40" y="48" textAnchor="middle" fill="#8d8d8d" fontSize="16" fontWeight="500">
                    --
                  </text>
                </svg>
              </motion.div>
              <p className="empty-text">No audit data available</p>
              <p className="empty-subtext">Click "Scan AI Model" to begin analysis</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score Range Legend */}
      <motion.div
        className="gauge-legend"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
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
      </motion.div>
    </div>
  );
}

export default TrustScoreGauge;

// Made with Bob