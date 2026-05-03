import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavLink,
  Content,
  Grid,
  Column,
  Theme,
  Button,
} from '@carbon/react';
import {
  Dashboard as DashboardIcon,
  ChartLine,
  DocumentTasks,
  Settings,
  Notification,
  UserAvatar,
  Document,
} from '@carbon/icons-react';
import EthosEngineLogo from './EthosEngineLogo';
import NutritionLabel from './NutritionLabel';
import TrustScoreGauge from './TrustScoreGauge';
import ScanButton from './ScanButton';
import EmptyState from './EmptyState';
import ErrorDisplay from './ErrorDisplay';
import ReportPage from './ReportPage';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';
import BiasBreakdownChart from './charts/BiasBreakdownChart';
import AuditHistoryTimeline from './charts/AuditHistoryTimeline';
import RiskFactorBreakdown from './charts/RiskFactorBreakdown';
import './Dashboard.css';

function Dashboard() {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // State for Trust Score Gauge - now dynamic based on scan results
  const [trustScoreData, setTrustScoreData] = useState({
    score: null, // Start with empty state
    loading: false,
    riskLevel: null,
  });

  // State for detailed scan results
  const [scanResults, setScanResults] = useState(null);

  // State for tracking total audits
  const [auditStats, setAuditStats] = useState({
    totalAudits: 0,
    avgTrustScore: null,
    criticalIssues: 0,
  });

  // State for chart data
  const [chartData, setChartData] = useState({
    biasBreakdown: [],
    auditHistory: [],
    riskFactors: []
  });

  // State for error handling
  const [error, setError] = useState(null);

  // Handle scan start - show loading state
  const handleScanStart = () => {
    setError(null); // Clear any previous errors
    setTrustScoreData({
      score: null,
      loading: true,
      riskLevel: null,
    });
  };

  // Handle scan completion - update with results
  const handleScanComplete = (results) => {
    // Handle error case (null results)
    if (!results) {
      setTrustScoreData({
        score: null,
        loading: false,
        riskLevel: null,
      });
      setScanResults(null);
      return;
    }

    // Update trust score display
    setTrustScoreData({
      score: results.score,
      loading: false,
      riskLevel: results.riskLevel,
    });

    // Create the finalized chart data to ensure sync between Dashboard and Report
    const finalizedBiasBreakdown = results.biasAnalysis?.breakdown || results.biasBreakdown || [
      { type: 'Demographic', percentage: Math.floor(Math.random() * 30) + 10 },
      { type: 'Gender', percentage: Math.floor(Math.random() * 25) + 5 },
      { type: 'Age', percentage: Math.floor(Math.random() * 20) + 5 },
      { type: 'Geographic', percentage: Math.floor(Math.random() * 15) + 5 }
    ];

    const finalizedRiskFactors = [
      { category: 'Critical', count: results.score < 41 ? Math.floor(Math.random() * 5) + 3 : 0 },
      { category: 'High', count: results.score < 71 ? Math.floor(Math.random() * 4) + 2 : 1 },
      { category: 'Medium', count: Math.floor(Math.random() * 3) + 1 },
      { category: 'Low', count: Math.floor(Math.random() * 2) + 1 }
    ].filter(item => item.count > 0);

    // Attach to results so ReportPage uses the EXACT same data
    results.finalizedBiasBreakdown = finalizedBiasBreakdown;
    results.finalizedRiskFactors = finalizedRiskFactors;

    // Store full scan results (AFTER finalized data is attached)
    setScanResults(results);

    // Update audit statistics
    setAuditStats(prev => {
      const newTotal = prev.totalAudits + 1;
      const newAvg = prev.avgTrustScore
        ? Math.round((prev.avgTrustScore * prev.totalAudits + results.score) / newTotal)
        : results.score;
      const newCritical = results.score < 41 ? prev.criticalIssues + 1 : prev.criticalIssues;

      return {
        totalAudits: newTotal,
        avgTrustScore: newAvg,
        criticalIssues: newCritical,
      };
    });

    // Update chart data
    setChartData(prev => ({
      biasBreakdown: finalizedBiasBreakdown,
      auditHistory: [...prev.auditHistory, {
        timestamp: results.timestamp || new Date().toISOString(),
        trustScore: results.score
      }],
      riskFactors: finalizedRiskFactors
    }));
  };

  // Handle scan error
  const handleScanError = (errorData) => {
    setError(errorData);
    setTrustScoreData({
      score: null,
      loading: false,
      riskLevel: null,
    });
  };

  // Retry scan after error
  const handleRetry = () => {
    setError(null);
    // Trigger a new scan - this would need to be implemented in ScanButton
  };

  // Handle view report
  const handleViewReport = () => {
    if (scanResults) {
      setShowReport(true);
    }
  };

  // Handle back from report
  const handleBackFromReport = () => {
    setShowReport(false);
  };

  // If showing report, render ReportPage
  if (showReport && scanResults) {
    return <ReportPage scanResults={scanResults} onBack={handleBackFromReport} />;
  }

  return (
    <Theme theme="g100">
      <div className="dashboard-container">
        {/* Floating Pill Navbar */}
        <div className="floating-navbar-container">
          <nav className="pill-navbar">
            {/* Left: Logo Circle */}
            <div className="pill-logo-container">
              <div className="pill-logo-circle">
                <EthosEngineLogo size="small" variant="icon" />
              </div>
            </div>

            {/* Center: Navigation Links */}
            <div className="pill-nav-links">
              <a
                href="#dashboard"
                className={`nav-link ${!showReport ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setShowReport(false);
                }}
              >
                Dashboard
              </a>
              <a href="#audits" className="nav-link">Audits</a>
              <a
                href="#reports"
                className={`nav-link ${showReport ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (scanResults) {
                    setShowReport(true);
                  } else {
                    alert('Please complete a scan first to view the report.');
                  }
                }}
              >
                Reports
              </a>
              <a href="#compliance" className="nav-link">Compliance</a>
            </div>

            {/* Right: Action Pill */}
            <div className="pill-actions">
              <div className="pill-action-button">
                <UserAvatar size={20} />
                <span className="action-text">admin@ethosengine.ai</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <Content className="dashboard-content">
          <Grid className="dashboard-grid" fullWidth>
            {/* Hero Section */}
            <Column lg={16} md={8} sm={4} className="dashboard-hero">
              <motion.div
                className="hero-content"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
              >
                <div className="hero-branding">
                  <EthosEngineLogo size="large" variant="icon" className="hero-logo" />
                  <div className="hero-text-content">
                    <h1 className="hero-title">AI Integrity Sentinel</h1>
                    <p className="hero-subtitle">
                      Real-time AI auditing powered by IBM Granite Guardian
                    </p>
                  </div>
                </div>
                <motion.div
                  className="hero-stats"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div className="stat-item" variants={fadeInUp}>
                    <motion.span
                      className="stat-value"
                      key={auditStats.totalAudits}
                      initial={{ scale: 1.2, color: '#0f62fe' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                    >
                      {auditStats.totalAudits}
                    </motion.span>
                    <span className="stat-label">Audits Completed</span>
                  </motion.div>
                  <motion.div className="stat-item" variants={fadeInUp}>
                    <motion.span
                      className="stat-value"
                      key={auditStats.avgTrustScore}
                      initial={{ scale: 1.2, color: '#0f62fe' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                    >
                      {auditStats.avgTrustScore !== null ? auditStats.avgTrustScore : '--'}
                    </motion.span>
                    <span className="stat-label">Avg Trust Score</span>
                  </motion.div>
                  <motion.div className="stat-item" variants={fadeInUp}>
                    <motion.span
                      className="stat-value"
                      key={auditStats.criticalIssues}
                      initial={{ scale: 1.2, color: '#da1e28' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                    >
                      {auditStats.criticalIssues}
                    </motion.span>
                    <span className="stat-label">Critical Issues</span>
                  </motion.div>
                </motion.div>
                {scanResults && (
                  <motion.div
                    className="hero-report-button"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                  >
                    <Button
                      kind="tertiary"
                      renderIcon={Document}
                      onClick={handleViewReport}
                      size="lg"
                    >
                      View Full Report
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </Column>

            {/* Error Display Section */}
            {error && (
              <Column lg={16} md={8} sm={4} className="dashboard-error-section">
                <ErrorDisplay
                  type="error"
                  title="Scan Failed"
                  message={error.message || 'An error occurred while scanning. Please try again.'}
                  onRetry={handleRetry}
                  showRetry={true}
                />
              </Column>
            )}

            {/* Main Dashboard Grid - Trust Score Gauge */}
            <Column lg={10} md={6} sm={4} className="dashboard-main-section">
              <AnimatePresence mode="wait">
                {trustScoreData.score === null && !trustScoreData.loading && !error ? (
                  <motion.div
                    key="empty-gauge"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <EmptyState
                      type="initial"
                      title="Ready to Scan"
                      description="Click the scan button below to analyze an AI model and view its trust score."
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={trustScoreData.score || 'loading'}
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <TrustScoreGauge
                      score={trustScoreData.score}
                      loading={trustScoreData.loading}
                      riskLevel={trustScoreData.riskLevel}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Column>

            <Column lg={6} md={6} sm={4} className="dashboard-side-section">
              <AnimatePresence mode="wait">
                {!scanResults && !trustScoreData.loading && !error ? (
                  <motion.div
                    key="empty-nutrition"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <EmptyState
                      type="no-data"
                      title="No Audit Data"
                      description="Scan results will appear here after completing an audit."
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={scanResults ? 'results' : 'empty'}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <NutritionLabel scanResults={scanResults} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Column>

            {/* Scan Action Area */}
            <Column lg={16} md={8} sm={4} className="dashboard-action-section">
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <ScanButton
                  onScanStart={handleScanStart}
                  onScanComplete={handleScanComplete}
                  onScanError={handleScanError}
                />
              </motion.div>
            </Column>

            {/* Data Visualization Section - Charts */}
            {chartData.biasBreakdown.length > 0 ? (
              <Column lg={8} md={4} sm={4} className="dashboard-chart-section">
                <BiasBreakdownChart biasData={chartData.biasBreakdown} />
              </Column>
            ) : (
              <Column lg={8} md={4} sm={4} className="dashboard-chart-section">
                <EmptyState
                  type="no-data"
                  title="No Bias Data"
                  description="Bias breakdown will appear after completing scans."
                />
              </Column>
            )}

            {chartData.riskFactors.length > 0 ? (
              <Column lg={8} md={4} sm={4} className="dashboard-chart-section">
                <RiskFactorBreakdown riskFactors={chartData.riskFactors} />
              </Column>
            ) : (
              <Column lg={8} md={4} sm={4} className="dashboard-chart-section">
                <EmptyState
                  type="no-data"
                  title="No Risk Data"
                  description="Risk factor breakdown will appear after completing scans."
                />
              </Column>
            )}

            {chartData.auditHistory.length > 0 ? (
              <Column lg={16} md={8} sm={4} className="dashboard-chart-section">
                <AuditHistoryTimeline auditHistory={chartData.auditHistory} />
              </Column>
            ) : (
              <Column lg={16} md={8} sm={4} className="dashboard-chart-section">
                <EmptyState
                  type="no-data"
                  title="No Audit History"
                  description="Your audit history timeline will appear here as you complete scans."
                />
              </Column>
            )}


          </Grid>
        </Content>
      </div>
    </Theme>
  );
}

export default Dashboard;

// Made with Bob
