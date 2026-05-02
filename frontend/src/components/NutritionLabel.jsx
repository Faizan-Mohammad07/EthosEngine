import { 
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Tag,
} from '@carbon/react';
import {
  DataBase,
  WarningAlt,
  Checkmark,
  Time,
} from '@carbon/icons-react';
import './NutritionLabel.css';

/**
 * AI Nutrition Label Component
 * Displays model attributes in a nutrition-label style format
 * Following UI Design Guidelines: Table-like structure with clear borders
 */
function NutritionLabel({ data }) {
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

  const labelData = data || mockData;

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

  return (
    <div className="nutrition-label">
      {/* Header Section */}
      <div className="nutrition-label-header">
        <h3 className="nutrition-label-title">AI Nutrition Label</h3>
        <p className="nutrition-label-subtitle">
          Model transparency and risk assessment
        </p>
      </div>

      {/* Model Information */}
      <div className="nutrition-section">
        <div className="section-header">
          <Time size={16} className="section-icon" />
          <h4 className="section-title">Model Information</h4>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Last Audit</span>
            <span className="info-value">{labelData.lastAudit}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Version</span>
            <span className="info-value">{labelData.modelVersion}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Training Date</span>
            <span className="info-value">{labelData.trainingDate}</span>
          </div>
        </div>
      </div>

      {/* Data Ingredients Section */}
      <div className="nutrition-section">
        <div className="section-header">
          <DataBase size={16} className="section-icon" />
          <h4 className="section-title">Data Ingredients</h4>
        </div>
        <StructuredListWrapper className="nutrition-list">
          <StructuredListBody>
            {labelData.dataIngredients.map((ingredient, index) => (
              <StructuredListRow key={index}>
                <StructuredListCell className="ingredient-cell">
                  <Checkmark size={16} className="ingredient-icon" />
                  <span className="ingredient-text">{ingredient}</span>
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
            {labelData.riskFactors.map((risk, index) => (
              <StructuredListRow key={index}>
                <StructuredListCell className="risk-cell">
                  {risk.type}
                </StructuredListCell>
                <StructuredListCell className="risk-cell risk-value">
                  {risk.value}
                </StructuredListCell>
                <StructuredListCell className="risk-cell">
                  <Tag
                    type={getRiskColor(risk.level)}
                    size="sm"
                    className="risk-tag"
                  >
                    {risk.level.toUpperCase()}
                  </Tag>
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </div>

      {/* Footer Note */}
      <div className="nutrition-footer">
        <p className="footer-text">
          This label provides transparency into the AI model's training data and potential risks.
          Regular audits ensure ongoing compliance and safety.
        </p>
      </div>
    </div>
  );
}

export default NutritionLabel;

// Made with Bob
