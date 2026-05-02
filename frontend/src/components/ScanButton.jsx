import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  TextInput,
  TextArea,
  Modal,
  InlineLoading,
  InlineNotification,
} from '@carbon/react';
import {
  Search,
  CheckmarkFilled,
  WarningAlt,
} from '@carbon/icons-react';
import apiService from '../services/api';
import { pulse, fadeIn, scaleIn } from '../utils/animations';
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
function ScanButton({ onScanComplete, onScanStart, onScanError }) {
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scanInput, setScanInput] = useState({
    modelName: '',
    modelDescription: '',
  });
  const [scanProgress, setScanProgress] = useState('');
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Handle scan with real API integration
  const handleScan = async () => {
    if (!scanInput.modelName.trim()) {
      return;
    }

    setShowModal(false);
    setIsScanning(true);
    setError(null);
    
    // Notify parent component that scan has started
    if (onScanStart) {
      onScanStart();
    }

    try {
      // Check if we should use mock data (fallback mode)
      const shouldUseMock = import.meta.env.VITE_USE_MOCK_DATA === 'true' || useMockData;

      if (shouldUseMock) {
        // Use mock data flow
        await handleMockScan();
      } else {
        // Use real API
        await handleRealScan();
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err);
      
      // Notify parent component of error
      if (onScanError) {
        onScanError(err);
      }
      
      // Offer to retry with mock data
      setUseMockData(true);
      
      if (onScanComplete) {
        onScanComplete(null); // Signal error to parent
      }
    } finally {
      setIsScanning(false);
      setScanProgress('');
    }
  };

  // Real API scan
  const handleRealScan = async () => {
    // Build content string from input
    const content = `Model: ${scanInput.modelName}\n${scanInput.modelDescription || 'No description provided'}`;

    // Progressive status updates
    setScanProgress('Connecting to IBM Granite Guardian...');
    await new Promise(resolve => setTimeout(resolve, 500));

    setScanProgress('Analyzing content for bias and safety...');
    
    // Call real API
    const result = await apiService.scanContent({
      content,
      scanType: 'comprehensive',
    });

    if (!result.success) {
      throw result.error;
    }

    setScanProgress('Processing results...');
    await new Promise(resolve => setTimeout(resolve, 300));

    // Transform API response to match expected format
    const transformedResults = transformApiResponse(result.data, scanInput.modelName);

    // Notify parent component with results
    if (onScanComplete) {
      onScanComplete(transformedResults);
    }

    setScanProgress('Scan complete!');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reset form
    setScanInput({ modelName: '', modelDescription: '' });
  };

  // Mock scan (fallback)
  const handleMockScan = async () => {
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

    const mockResults = generateMockResults(scanInput);

    if (onScanComplete) {
      onScanComplete(mockResults);
    }

    setScanProgress('Scan complete!');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setScanInput({ modelName: '', modelDescription: '' });
  };

  // Transform API response to component format
  const transformApiResponse = (apiData, modelName) => {
    return {
      score: apiData.trustScore,
      modelName: modelName,
      timestamp: apiData.timestamp,
      riskLevel: apiData.riskLevel,
      biasAnalysis: apiData.biasAnalysis,
      safetyAnalysis: apiData.safetyAnalysis,
      dataIngredients: apiData.dataIngredients,
      riskFactors: apiData.riskFactors,
    };
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
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setUseMockData(false);
  };

  const handleUseMockData = () => {
    setError(null);
    setUseMockData(true);
    handleScan();
  };

  const isFormValid = scanInput.modelName.trim().length > 0;

  return (
    <div className="scan-button-container">
      {/* Error Notification */}
      {error && !isScanning && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <InlineNotification
            kind="error"
            title="Scan Failed"
            subtitle={error.message || 'Unable to connect to backend. Check if the API is running.'}
            onCloseButtonClick={() => setError(null)}
            actions={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button size="sm" kind="tertiary" onClick={handleRetry}>
                  Retry
                </Button>
                <Button size="sm" kind="secondary" onClick={handleUseMockData}>
                  Use Demo Mode
                </Button>
              </div>
            }
            className="scan-error-notification"
          />
        </motion.div>
      )}

      {/* Mock Data Mode Indicator */}
      {useMockData && !error && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <InlineNotification
            kind="info"
            title="Demo Mode Active"
            subtitle="Using simulated data. Connect to backend for real IBM Granite analysis."
            hideCloseButton
            lowContrast
            className="scan-info-notification"
          />
        </motion.div>
      )}

      {/* Main Scan Button */}
      <div className="scan-button-wrapper">
        {isScanning ? (
          <motion.div
            className="scanning-state"
            variants={scaleIn}
            initial="initial"
            animate="animate"
          >
            <InlineLoading
              description={scanProgress}
              status="active"
              className="scan-loading"
            />
            <div className="scanning-animation">
              <motion.div
                className="scan-pulse"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="scan-pulse delay-1"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              <motion.div
                className="scan-pulse delay-2"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(15, 98, 254, 0)',
                  '0 0 0 8px rgba(15, 98, 254, 0.1)',
                  '0 0 0 0 rgba(15, 98, 254, 0)'
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              style={{ display: 'inline-block', borderRadius: '4px' }}
            >
              <Button
                kind="primary"
                size="lg"
                renderIcon={Search}
                onClick={handleOpenModal}
                className="scan-button"
              >
                Scan AI Model
              </Button>
            </motion.div>
            <motion.p
              className="scan-button-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Click to analyze your AI model for bias and safety issues
            </motion.p>
          </motion.div>
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
        <motion.div
          className="scan-modal-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
      </Modal>

      {/* Quick Stats - Show when not scanning */}
      {!isScanning && (
        <motion.div
          className="scan-stats"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            className="stat-card"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="stat-number">~5s</span>
            <span className="stat-label">Avg Scan Time</span>
          </motion.div>
          <motion.div
            className="stat-card"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="stat-number">7</span>
            <span className="stat-label">Audit Checks</span>
          </motion.div>
          <motion.div
            className="stat-card"
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="stat-number">100%</span>
            <span className="stat-label">IBM Powered</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ScanButton;

// Made with Bob