/**
 * RiskFactorBreakdown Component
 * 
 * Displays a donut chart showing the distribution of risk factors
 * across different severity levels (Critical, High, Medium, Low).
 * 
 * Features:
 * - Color-coded segments by severity
 * - Interactive tooltips
 * - Center label showing total risks
 * - Responsive design
 */

import { DonutChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import './RiskFactorBreakdown.css';

function RiskFactorBreakdown({ riskFactors }) {
  // Transform risk factors data for Carbon Charts format
  const chartData = riskFactors?.map(factor => {
    // Handle both object and string formats from the API
    if (typeof factor === 'string') {
      return { group: factor, value: 1 };
    }
    return {
      group: factor.category || factor.severity || factor.level || 'Unknown',
      value: factor.count || factor.value || 1
    };
  }).filter(item => item.group) || [];

  // Calculate total risks
  const totalRisks = chartData.reduce((sum, item) => sum + item.value, 0);

  // Chart configuration options
  const options = {
    title: 'Risk Factor Distribution',
    theme: 'g100',
    resizable: true,
    donut: {
      center: {
        label: 'Total Risks',
        number: totalRisks
      },
      alignment: 'center'
    },
    height: '350px',
    toolbar: {
      enabled: false
    },
    legend: {
      enabled: true,
      position: 'right',
      alignment: 'center'
    },
    color: {
      scale: {
        'Critical': '#da1e28',    // Red
        'High': '#ff832b',        // Orange
        'Medium': '#f1c21b',      // Yellow
        'Low': '#24a148',         // Green
        'Minimal': '#0f62fe'      // Blue
      }
    },
    pie: {
      labels: {
        enabled: true,
        formatter: (data) => {
          // Carbon Charts label formatter can receive an object or a raw value
          const value = typeof data === 'object' ? data.value : data;
          return `${value}`;
        }
      }
    },
    tooltip: {
      enabled: true,
      showTotal: true,
      valueFormatter: (value) => `${value} issues`
    }
  };

  // Empty state
  if (!riskFactors || riskFactors.length === 0) {
    return (
      <div className="risk-chart-container">
        <div className="risk-chart-empty">
          <h4>Risk Factor Distribution</h4>
          <p>No risk data available. Run a scan to see risk breakdown.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="risk-chart-container">
      <DonutChart data={chartData} options={options} />
      <div className="risk-chart-summary">
        <div className="summary-grid">
          {chartData.map((item, index) => (
            <div key={index} className={`summary-item severity-${(item.group || 'unknown').toLowerCase()}`}>
              <div className="summary-header">
                <span className="summary-dot"></span>
                <span className="summary-label">{item.group}</span>
              </div>
              <span className="summary-value">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="risk-chart-footer">
          <p className="footer-text">
            Total of <strong>{totalRisks}</strong> risk factors identified across all categories
          </p>
        </div>
      </div>
    </div>
  );
}

export default RiskFactorBreakdown;

// Made with Bob