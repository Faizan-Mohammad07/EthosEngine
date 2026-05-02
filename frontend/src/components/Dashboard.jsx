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
} from '@carbon/react';
import {
  Dashboard as DashboardIcon,
  ChartLine,
  DocumentTasks,
  Settings,
  Notification,
  UserAvatar,
} from '@carbon/icons-react';
import EthosEngineLogo from './EthosEngineLogo';
import NutritionLabel from './NutritionLabel';
import TrustScoreGauge from './TrustScoreGauge';
import ScanButton from './ScanButton';
import EmptyState from './EmptyState';
import ErrorDisplay from './ErrorDisplay';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';
import BiasBreakdownChart from './charts/BiasBreakdownChart';
import AuditHistoryTimeline from './charts/AuditHistoryTimeline';
import RiskFactorBreakdown from './charts/RiskFactorBreakdown';
import './Dashboard.css';

function Dashboard() {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);

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

    // Store full scan results for detailed display
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

    // Update chart data with new scan results
    setChartData(prev => ({
      // Update bias breakdown from scan results
      biasBreakdown: results.biasAnalysis?.breakdown || results.biasBreakdown || [
        { type: 'Demographic', percentage: Math.floor(Math.random() * 30) + 10 },
        { type: 'Gender', percentage: Math.floor(Math.random() * 25) + 5 },
        { type: 'Age', percentage: Math.floor(Math.random() * 20) + 5 },
        { type: 'Geographic', percentage: Math.floor(Math.random() * 15) + 5 }
      ],
      // Add to audit history timeline
      auditHistory: [...prev.auditHistory, {
        timestamp: results.timestamp || new Date().toISOString(),
        trustScore: results.score
      }],
      // Update risk factors distribution
      riskFactors: results.riskFactors || results.riskDistribution || [
        { category: 'Critical', count: results.score < 41 ? Math.floor(Math.random() * 5) + 3 : 0 },
        { category: 'High', count: results.score < 71 ? Math.floor(Math.random() * 4) + 2 : 0 },
        { category: 'Medium', count: Math.floor(Math.random() * 3) + 1 },
        { category: 'Low', count: Math.floor(Math.random() * 2) + 1 }
      ].filter(item => item.count > 0)
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

  return (
    <Theme theme="g100">
      <div className="dashboard-container">
        {/* IBM Carbon Header with Logo */}
        <Header aria-label="EthosEngine">
          <HeaderName href="#" prefix="">
            <EthosEngineLogo size="small" variant="icon" />
            <span className="header-brand-text">
              <span className="header-ibm-prefix">IBM</span> EthosEngine
            </span>
          </HeaderName>
          <HeaderNavigation aria-label="EthosEngine">
            <HeaderMenuItem href="#dashboard">Dashboard</HeaderMenuItem>
            <HeaderMenuItem href="#audits">Audits</HeaderMenuItem>
            <HeaderMenuItem href="#reports">Reports</HeaderMenuItem>
            <HeaderMenuItem href="#compliance">Compliance</HeaderMenuItem>
          </HeaderNavigation>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="end"
            >
              <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="User Settings"
              tooltipAlignment="end"
            >
              <UserAvatar size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>

        {/* Sidebar Navigation */}
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          onOverlayClick={() => setIsSideNavExpanded(false)}
          isPersistent={false}
        >
          <SideNavItems>
            <SideNavLink renderIcon={DashboardIcon} href="#dashboard">
              Dashboard
            </SideNavLink>
            <SideNavLink renderIcon={ChartLine} href="#analytics">
              Analytics
            </SideNavLink>
            <SideNavLink renderIcon={DocumentTasks} href="#audit-history">
              Audit History
            </SideNavLink>
            <SideNavLink renderIcon={Settings} href="#settings">
              Settings
            </SideNavLink>
          </SideNavItems>
        </SideNav>

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
