import { motion, AnimatePresence } from 'framer-motion';
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Tag,
  SkeletonText,
  SkeletonPlaceholder,
} from '@carbon/react';
import {
  DataBase,
  WarningAlt,
  Checkmark,
  Time,
} from '@carbon/icons-react';
import { fadeInUp, staggerContainer } from '../utils/animations';
import './NutritionLabel.css';

/**
 * AI Nutrition Label Component
 * Displays model attributes in a nutrition-label style format
 */
function NutritionLabel({ scanResults, loading = false }) {
  // Default mock data for initial state
  const mockData = {
    dataIngredients: ["Public Datasets", "Proprietary Data", "Synthetic Data"],
    riskFactors: [
      { type: "Bias Detection", value: "Scanning...", level: "gray" },
      { type: "Safety Check", value: "Scanning...", level: "gray" }
    ],
    lastAudit: "--",
    modelVersion: "No model scanned",
    trainingDate: "--"
  };

  // Transform API scan results to label format
  const transformScanResults = (results) => {
    if (!results) return null;

    const riskFactors = [];
    
    // 1. Map Bias Analysis
    if (results.biasAnalysis) {
      const bScore = results.biasAnalysis.score || 0;
      riskFactors.push({
        type: "Bias Analysis",
        value: `${bScore}/100`,
        level: bScore < 30 ? 'green' : bScore < 60 ? 'yellow' : 'red'
      });
    }

    // 2. Map Safety Analysis
    if (results.safetyAnalysis) {
      const sScore = results.safetyAnalysis.score || 0;
      riskFactors.push({
        type: "Safety Analysis",
        value: `${sScore}/100`,
        level: sScore < 30 ? 'green' : sScore < 60 ? 'yellow' : 'red'
      });
    }

    // 3. Add any specific risk factors from backend
    if (results.riskFactors && Array.isArray(results.riskFactors)) {
      results.riskFactors.forEach((risk, i) => {
        if (typeof risk === 'string') {
          riskFactors.push({
            type: `Risk Indicator ${i+1}`,
            value: risk,
            level: 'yellow'
          });
        }
      });
    }

    // 4. Handle Data Ingredients
    let ingredients = [];
    if (Array.isArray(results.dataIngredients)) {
      ingredients = results.dataIngredients;
    } else if (results.dataIngredients && typeof results.dataIngredients === 'string') {
      ingredients = results.dataIngredients.split(',').map(s => s.trim());
    }

    return {
      dataIngredients: ingredients.length > 0 ? ingredients : ["Model Content", "User Prompt"],
      riskFactors: riskFactors,
      lastAudit: results.timestamp ? new Date(results.timestamp).toLocaleDateString() : new Date().toLocaleDateString(),
      modelVersion: results.modelName || "Custom Model",
      trainingDate: results.timestamp ? new Date(results.timestamp).toLocaleDateString() : "Live Scan"
    };
  };

  const labelData = scanResults ? transformScanResults(scanResults) : mockData;

  // Loading skeleton
  if (loading) return <SkeletonPlaceholder style={{ height: '400px', width: '100%' }} />;

  return (
    <motion.div 
      className="nutrition-label"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <div className="nutrition-label-header">
        <h3 className="nutrition-label-title">AI Nutrition Label</h3>
        <p className="nutrition-label-subtitle">Model transparency and risk assessment</p>
      </div>

      {/* Model Info Section */}
      <div className="nutrition-section">
        <div className="section-header">
          <Time size={16} className="section-icon" />
          <h4 className="section-title">MODEL INFORMATION</h4>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">LAST AUDIT</span>
            <span className="info-value">{labelData.lastAudit}</span>
          </div>
          <div className="info-item">
            <span className="info-label">VERSION</span>
            <span className="info-value">{labelData.modelVersion}</span>
          </div>
          <div className="info-item">
            <span className="info-label">TRAINING DATE</span>
            <span className="info-value">{labelData.trainingDate}</span>
          </div>
        </div>
      </div>

      {/* Data Ingredients Section */}
      <div className="nutrition-section">
        <div className="section-header">
          <DataBase size={16} className="section-icon" />
          <h4 className="section-title">DATA INGREDIENTS</h4>
        </div>
        <StructuredListWrapper isCondensed>
          <StructuredListBody>
            {labelData.dataIngredients.map((item, index) => (
              <StructuredListRow key={index}>
                <StructuredListCell>
                  <Checkmark size={16} style={{ color: '#24a148', marginRight: '8px', verticalAlign: 'middle' }} />
                  {item}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </div>

      {/* Risk Factors Section */}
      <div className="nutrition-section">
        <div className="section-header">
          <WarningAlt size={16} className="section-icon" />
          <h4 className="section-title">RISK FACTORS</h4>
        </div>
        <StructuredListWrapper isCondensed>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>FACTOR</StructuredListCell>
              <StructuredListCell head>SCORE</StructuredListCell>
              <StructuredListCell head>STATUS</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {labelData.riskFactors.map((risk, index) => (
              <StructuredListRow key={index}>
                <StructuredListCell>{risk.type}</StructuredListCell>
                <StructuredListCell className="risk-value">{risk.value}</StructuredListCell>
                <StructuredListCell>
                  <span
                    className="risk-status-badge"
                    style={{
                      backgroundColor:
                        risk.level === 'green' ? '#24a148' :
                        risk.level === 'yellow' ? '#f1c21b' :
                        risk.level === 'red' ? '#da1e28' : '#525252',
                      color: risk.level === 'yellow' ? '#161616' : '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      display: 'inline-block',
                    }}
                  >
                    {risk.level.toUpperCase()}
                  </span>
                </StructuredListCell>
              </StructuredListRow>
            ))}
            {labelData.riskFactors.length === 0 && (
              <StructuredListRow>
                <StructuredListCell colSpan={3}>No critical risks identified.</StructuredListCell>
              </StructuredListRow>
            )}
          </StructuredListBody>
        </StructuredListWrapper>
      </div>
    </motion.div>
  );
}

export default NutritionLabel;
