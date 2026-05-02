import { useState } from 'react';
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
import './Dashboard.css';

function Dashboard() {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);

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
              <div className="hero-content">
                <h1 className="hero-title">AI Integrity Sentinel</h1>
                <p className="hero-subtitle">
                  Real-time AI auditing powered by IBM Granite Guardian
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Audits Completed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">--</span>
                    <span className="stat-label">Avg Trust Score</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Critical Issues</span>
                  </div>
                </div>
              </div>
            </Column>

            {/* Main Dashboard Grid - Placeholder for components */}
            <Column lg={10} md={6} sm={4} className="dashboard-main-section">
              <div className="component-placeholder">
                <h3>Trust Score Gauge</h3>
                <p>Component will be added in Task 4</p>
              </div>
            </Column>

            <Column lg={6} md={6} sm={4} className="dashboard-side-section">
              <NutritionLabel />
            </Column>

            {/* Scan Action Area */}
            <Column lg={16} md={8} sm={4} className="dashboard-action-section">
              <div className="component-placeholder action-placeholder">
                <h3>Scan Button</h3>
                <p>Component will be added in Task 5</p>
              </div>
            </Column>

            {/* Additional Info Section */}
            <Column lg={16} md={8} sm={4} className="dashboard-info-section">
              <div className="info-card">
                <h4>Development Progress</h4>
                <ul>
                  <li>✅ Dashboard layout created with IBM Carbon Design System</li>
                  <li>✅ Responsive grid system implemented</li>
                  <li>✅ Header and navigation configured</li>
                  <li>✅ AI Nutrition Label component integrated</li>
                  <li>⏳ Awaiting Trust Score Gauge component</li>
                  <li>⏳ Awaiting Scan Button component</li>
                </ul>
              </div>
            </Column>
          </Grid>
        </Content>
      </div>
    </Theme>
  );
}

export default Dashboard;

// Made with Bob
