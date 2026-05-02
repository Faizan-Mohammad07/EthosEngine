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
import NutritionLabel from './NutritionLabel';
import TrustScoreGauge from './TrustScoreGauge';
import ScanButton from './ScanButton';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';
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

  // Handle scan start - show loading state
  const handleScanStart = () => {
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
  };

  return (
    <Theme theme="g100">
      <div className="dashboard-container">
        {/* IBM Carbon Header */}
        <Header aria-label="EthosEngine">
          <HeaderName href="#" prefix="IBM">
            EthosEngine
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
                <h1 className="hero-title">AI Integrity Sentinel</h1>
                <p className="hero-subtitle">
                  Real-time AI auditing powered by IBM Granite Guardian
                </p>
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

            {/* Main Dashboard Grid - Trust Score Gauge */}
            <Column lg={10} md={6} sm={4} className="dashboard-main-section">
              <AnimatePresence mode="wait">
                <motion.div
                  key={trustScoreData.score || 'empty'}
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
              </AnimatePresence>
            </Column>

            <Column lg={6} md={6} sm={4} className="dashboard-side-section">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scanResults ? 'results' : 'empty'}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <NutritionLabel scanResults={scanResults} />
                </motion.div>
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
                />
              </motion.div>
            </Column>

            {/* Additional Info Section */}
            <Column lg={16} md={8} sm={4} className="dashboard-info-section">
              <motion.div
                className="info-card"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <h4>Development Progress - Priority #3 Task 2 Complete! 🎉</h4>
                <ul>
                  <li>✅ Dashboard layout created with IBM Carbon Design System</li>
                  <li>✅ Responsive grid system implemented</li>
                  <li>✅ Header and navigation configured</li>
                  <li>✅ AI Nutrition Label component integrated</li>
                  <li>✅ Trust Score Gauge component with smooth animations</li>
                  <li>✅ Scan Button with loading states and modal input</li>
                  <li>✅ Full integration: Scan → Loading → Results → Stats update</li>
                  <li>✅ Enhanced animations with Framer Motion</li>
                  <li>✅ Smooth state transitions throughout dashboard</li>
                </ul>
              </motion.div>
            </Column>
          </Grid>
        </Content>
      </div>
    </Theme>
  );
}

export default Dashboard;

// Made with Bob
