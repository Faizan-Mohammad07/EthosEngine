import { useState } from 'react';
import { 
  Button,
  TextInput,
  TextArea,
  Modal,
  InlineLoading,
} from '@carbon/react';
import {
  Search,
  CheckmarkFilled,
} from '@carbon/icons-react';
import './ScanButton.css';

/**
 * Scan Button Component
 * IBM Carbon button with loading state that triggers simulated API call
 * Following UI Design Guidelines:
 * - Clear call-to-action button
 * - Loading state with skeleton
 * - Professional flat design
 * - Primary Blue (#0f62fe) for actionable elements
 */
function ScanButton({ onScanComplete, onScanStart }) {
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scanInput, setScanInput] = useState({
    modelName: '',
    modelDescription: '',
  });
  const [scanProgress, setScanProgress] = useState('');

  // Simulate API call with progressive loading states
  const handleScan = async () => {
    if (!scanInput.modelName.trim()) {
      return;
    }

    setShowModal(false);
    setIsScanning(true);
    
    // Notify parent component that scan has started
    if (onScanStart) {
      onScanStart();
    }

    // Simulate progressive scanning with realistic delays
    const scanSteps = [
      { message: 'Initializing AI model analysis...', delay: 800 },
      { message: 'Scanning for demographic bias...', delay: 1200 },
      { message: 'Analyzing safety protocols...', delay: 1000 },
      { message: 'Checking toxicity levels...', delay: 900 },
      { message: 'Evaluating fairness metrics...', delay: 1100 },
      { message: 'Generating trust score...', delay: 800 },
      { message: 'Finalizing audit report...', delay: 600 },
    ];

    for (const step of scanSteps) {
      setScanProgress(step.message);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    // Generate mock audit results based on input
    const mockResults = generateMockResults(scanInput);

    // Notify parent component with results
    if (onScanComplete) {
      onScanComplete(mockResults);
    }

    setScanProgress('Scan complete!');
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsScanning(false);
    setScanProgress('');
    
    // Reset form
    setScanInput({ modelName: '', modelDescription: '' });
  };

  // Generate realistic mock results based on input
  const generateMockResults = (input) => {
    // Simple heuristic: longer descriptions = more thorough = higher score
    const descriptionLength = input.modelDescription.length;
    const baseScore = 50;
    const lengthBonus = Math.min(30, Math.floor(descriptionLength / 20));
    const randomVariation = Math.floor(Math.random() * 20) - 10;
    const finalScore = Math.max(0, Math.min(100, baseScore + lengthBonus + randomVariation));

    return {
      score: finalScore,
      modelName: input.modelName,
      timestamp: new Date().toISOString(),
      riskLevel: finalScore >= 71 ? 'green' : finalScore >= 41 ? 'yellow' : 'red',
    };
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const isFormValid = scanInput.modelName.trim().length > 0;

  return (
    <div className="scan-button-container">
      {/* Main Scan Button */}
      <div className="scan-button-wrapper">
        {isScanning ? (
          <div className="scanning-state">
            <InlineLoading
              description={scanProgress}
              status="active"
              className="scan-loading"
            />
            <div className="scanning-animation">
              <div className="scan-pulse"></div>
              <div className="scan-pulse delay-1"></div>
              <div className="scan-pulse delay-2"></div>
            </div>
          </div>
        ) : (
          <>
            <Button
              kind="primary"
              size="lg"
              renderIcon={Search}
              onClick={handleOpenModal}
              className="scan-button"
            >
              Scan AI Model
            </Button>
            <p className="scan-button-hint">
              Click to analyze your AI model for bias and safety issues
            </p>
          </>
        )}
      </div>

      {/* Scan Input Modal */}
      <Modal
        open={showModal}
        onRequestClose={handleCloseModal}
        onRequestSubmit={handleScan}
        modalHeading="Scan AI Model"
        modalLabel="AI Integrity Audit"
        primaryButtonText="Start Scan"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!isFormValid}
        size="md"
        className="scan-modal"
      >
        <div className="scan-modal-content">
          <p className="modal-description">
            Provide information about your AI model to begin the integrity audit.
            Our system will analyze bias, safety, and compliance factors.
          </p>

          <TextInput
            id="model-name"
            labelText="Model Name"
            placeholder="e.g., HR Hiring Assistant v2.1"
            value={scanInput.modelName}
            onChange={(e) => setScanInput({ ...scanInput, modelName: e.target.value })}
            required
            className="modal-input"
          />

          <TextArea
            id="model-description"
            labelText="Model Description (Optional)"
            placeholder="Describe your AI model's purpose, training data, and use cases..."
            value={scanInput.modelDescription}
            onChange={(e) => setScanInput({ ...scanInput, modelDescription: e.target.value })}
            rows={4}
            className="modal-textarea"
          />

          <div className="modal-info">
            <CheckmarkFilled size={16} className="info-icon" />
            <span className="info-text">
              This is a demo. Real scans will use IBM Granite Guardian for analysis.
            </span>
          </div>
        </div>
      </Modal>

      {/* Quick Stats - Show when not scanning */}
      {!isScanning && (
        <div className="scan-stats">
          <div className="stat-card">
            <span className="stat-number">~5s</span>
            <span className="stat-label">Avg Scan Time</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">7</span>
            <span className="stat-label">Audit Checks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">IBM Powered</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScanButton;

// Made with Bob