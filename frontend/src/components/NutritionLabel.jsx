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
import { fadeInUp, staggerContainer, slideInRight } from '../utils/animations';
import './NutritionLabel.css';

/**
 * AI Nutrition Label Component
 * Displays model attributes in a nutrition-label style format
 * Following UI Design Guidelines: Table-like structure with clear borders
 */
function NutritionLabel({ scanResults, loading = false }) {
  // Mock data structure as specified in the plan
  const mockData = {
    dataIngredients: [
      "Public datasets (ImageNet, COCO)",
      "Proprietary customer data",
      "Synthetic augmented data",
      "Third-party licensed datasets"
    ],
    riskFactors: [
      { type: "Demographic bias", value: "12%", level: "yellow" },
      { type: "Safety score", value: "85%", level: "green" },
      { type: "Toxicity detection", value: "92%", level: "green" },
      { type: "Fairness index", value: "68%", level: "yellow" }
    ],
    lastAudit: "2026-05-02",
    modelVersion: "v2.3.1",
    trainingDate: "2026-04-15"
  };

  // Transform API scan results to label format
  const transformScanResults = (results) => {
    if (!results) return null;

    const riskFactors = [];
    
    // Add bias analysis if available
    if (results.biasAnalysis) {
      const biasScore = results.biasAnalysis.score || 0;
      riskFactors.push({
        type: "Bias Score",
        value: `${biasScore}/100`,
        level: biasScore < 30 ? 'green' : biasScore < 60 ? 'yellow' : 'red'
      });

      if (results.biasAnalysis.types && results.biasAnalysis.types.length > 0) {
        riskFactors.push({
          type: "Bias Types Detected",
          value: results.biasAnalysis.types.join(', '),
          level: 'yellow'
        });
      }
    }

    // Add safety analysis if available
    if (results.safetyAnalysis) {
      const safetyScore = results.safetyAnalysis.score || 0;
      riskFactors.push({
        type: "Safety Risk Score",
        value: `${safetyScore}/100`,
        level: safetyScore < 30 ? 'green' : safetyScore < 60 ? 'yellow' : 'red'
      });

      if (results.safetyAnalysis.categoriesDetected && results.safetyAnalysis.categoriesDetected.length > 0) {
        riskFactors.push({
          type: "Safety Categories",
          value: results.safetyAnalysis.categoriesDetected.join(', '),
          level: 'red'
        });
      }
    }

    return {
      dataIngredients: results.dataIngredients || [],
      riskFactors: riskFactors.length > 0 ? riskFactors : results.riskFactors || [],
      lastAudit: results.timestamp ? new Date(results.timestamp).toLocaleDateString() : new Date().toLocaleDateString(),
      modelVersion: results.modelName || "Unknown",
      trainingDate: results.timestamp ? new Date(results.timestamp).toLocaleDateString() : "N/A"
    };
  };

  const labelData = scanResults ? transformScanResults(scanResults) : mockData;

  // Get risk level color based on guidelines
  const getRiskColor = (level) => {
    switch (level) {
      case 'green':
        return 'green'; // Safe: #24a148
      case 'yellow':
        return 'yellow'; // Caution: #f1c21b
      case 'red':
        return 'red'; // Critical: #da1e28
      default:
        return 'gray';
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="nutrition-label">
      <div className="nutrition-label-header">
        <SkeletonText heading width="60%" />
        <SkeletonText width="80%" />
      </div>
      
      <div className="nutrition-section">
        <SkeletonText heading width="40%" />
        <div className="info-grid">
          <SkeletonPlaceholder style={{ height: '40px', width: '100%' }} />
          <SkeletonPlaceholder style={{ height: '40px', width: '100%' }} />
          <SkeletonPlaceholder style={{ height: '40px', width: '100%' }} />
        </div>
      </div>

      <div className="nutrition-section">
        <SkeletonText heading width="40%" />
        <SkeletonPlaceholder style={{ height: '120px', width: '100%', marginTop: '8px' }} />
      </div>

      <div className="nutrition-section">
        <SkeletonText heading width="40%" />
        <SkeletonPlaceholder style={{ height: '160px', width: '100%', marginTop: '8px' }} />
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      className="nutrition-label"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Header Section */}
      <motion.div
        className="nutrition-label-header"
        variants={fadeInUp}
      >
        <h3 className="nutrition-label-title">AI Nutrition Label</h3>
        <p className="nutrition-label-subtitle">
          Model transparency and risk assessment
        </p>
      </motion.div>

      {/* Model Information */}
      <motion.div
        className="nutrition-section"
        variants={fadeInUp}
      >
        <div className="section-header">
          <Time size={16} className="section-icon" />
          <h4 className="section-title">Model Information</h4>
        </div>
        <motion.div
          className="info-grid"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="info-item" variants={slideInRight}>
            <span className="info-label">Last Audit</span>
            <motion.span
              className="info-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {labelData.lastAudit}
            </motion.span>
          </motion.div>
          <motion.div className="info-item" variants={slideInRight}>
            <span className="info-label">Version</span>
            <motion.span
              className="info-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {labelData.modelVersion}
            </motion.span>
          </motion.div>
          <motion.div className="info-item" variants={slideInRight}>
            <span className="info-label">Training Date</span>
            <motion.span
              className="info-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {labelData.trainingDate}
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Data Ingredients Section */}
      <motion.div
        className="nutrition-section"
        variants={fadeInUp}
      >
        <div className="section-header">
          <DataBase size={16} className="section-icon" />
          <h4 className="section-title">Data Ingredients</h4>
        </div>
        <StructuredListWrapper className="nutrition-list">
          <StructuredListBody>
            <AnimatePresence>
              {labelData.dataIngredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
                  <StructuredListRow>
                    <StructuredListCell className="ingredient-cell">
                      <Checkmark size={16} className="ingredient-icon" />
                      <span className="ingredient-text">{ingredient}</span>
                    </StructuredListCell>
                  </StructuredListRow>
                </motion.div>
              ))}
            </AnimatePresence>
          </StructuredListBody>
        </StructuredListWrapper>
      </motion.div>

      {/* Risk Factors Section */}
      <motion.div
        className="nutrition-section"
        variants={fadeInUp}
      >
        <div className="section-header">
          <WarningAlt size={16} className="section-icon" />
          <h4 className="section-title">Risk Factors</h4>
        </div>
        <StructuredListWrapper className="nutrition-list">
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head className="risk-header-cell">
                Factor
              </StructuredListCell>
              <StructuredListCell head className="risk-header-cell">
                Score
              </StructuredListCell>
              <StructuredListCell head className="risk-header-cell">
                Status
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <AnimatePresence>
              {labelData.riskFactors.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 1.0 }}
                >
                  <StructuredListRow>
                    <StructuredListCell className="risk-cell">
                      {risk.type}
                    </StructuredListCell>
                    <StructuredListCell className="risk-cell risk-value">
                      {risk.value}
                    </StructuredListCell>
                    <StructuredListCell className="risk-cell">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 1.1, type: "spring", stiffness: 200 }}
                      >
                        <Tag
                          type={getRiskColor(risk.level)}
                          size="sm"
                          className="risk-tag"
                        >
                          {risk.level.toUpperCase()}
                        </Tag>
                      </motion.div>
                    </StructuredListCell>
                  </StructuredListRow>
                </motion.div>
              ))}
            </AnimatePresence>
          </StructuredListBody>
        </StructuredListWrapper>
      </motion.div>

      {/* Footer Note */}
      <motion.div
        className="nutrition-footer"
        variants={fadeInUp}
      >
        <p className="footer-text">
          This label provides transparency into the AI model's training data and potential risks.
          Regular audits ensure ongoing compliance and safety.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default NutritionLabel;

// Made with Bob
