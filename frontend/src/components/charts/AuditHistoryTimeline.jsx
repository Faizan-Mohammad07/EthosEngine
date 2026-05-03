/**
 * AuditHistoryTimeline Component
 * 
 * Displays a line chart showing the history of trust scores over time.
 * Helps visualize trends and patterns in AI model audits.
 * 
 * Features:
 * - Time-series visualization
 * - Color-coded zones (Red/Yellow/Green)
 * - Interactive tooltips
 * - Responsive design
 */

import { LineChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import './AuditHistoryTimeline.css';

function AuditHistoryTimeline({ auditHistory }) {
  // Transform audit history data for Carbon Charts format
  const chartData = auditHistory?.map(audit => ({
    group: 'Trust Score',
    date: new Date(audit.timestamp),
    value: audit.trustScore || audit.score || 0
  })) || [];

  // Chart configuration options
  const options = {
    title: 'Trust Score History',
    theme: 'g100',
    axes: {
      bottom: {
        title: 'Date & Time',
        mapsTo: 'date',
        scaleType: 'time'
      },
      left: {
        title: 'Trust Score',
        mapsTo: 'value',
        domain: [0, 100],
        ticks: {
          values: [0, 25, 50, 75, 100]
        }
      }
    },
    curve: 'curveMonotoneX',
    height: '350px',
    toolbar: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    points: {
      enabled: true,
      radius: 5,
      filled: true
    },
    color: {
      scale: {
        'Trust Score': '#0f62fe'  // IBM Blue
      }
    },
    grid: {
      x: {
        enabled: true
      },
      y: {
        enabled: true
      }
    },
    tooltip: {
      enabled: true,
      showTotal: false
    },
    zoomBar: {
      top: {
        enabled: auditHistory && auditHistory.length > 10
      }
    }
  };

  // Empty state
  if (!auditHistory || auditHistory.length === 0) {
    return (
      <div className="timeline-chart-container">
        <div className="timeline-chart-empty">
          <h4>Trust Score History</h4>
          <p>No audit history available. Complete scans to build your timeline.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-chart-container">
      <LineChart data={chartData} options={options} />
      <div className="timeline-chart-zones">
        <div className="zone-indicator">
          <div className="zone-bar">
            <div className="zone critical" style={{ height: '40%' }}>
              <span className="zone-label">Critical (0-40)</span>
            </div>
            <div className="zone warning" style={{ height: '30%' }}>
              <span className="zone-label">Warning (41-70)</span>
            </div>
            <div className="zone safe" style={{ height: '30%' }}>
              <span className="zone-label">Safe (71-100)</span>
            </div>
          </div>
        </div>
        <div className="timeline-stats">
          <div className="stat">
            <span className="stat-label">Total Audits:</span>
            <span className="stat-value">{auditHistory.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Latest Score:</span>
            <span className="stat-value">
              {auditHistory[auditHistory.length - 1]?.trustScore || 
               auditHistory[auditHistory.length - 1]?.score || 0}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Average:</span>
            <span className="stat-value">
              {Math.round(
                auditHistory.reduce((sum, audit) => 
                  sum + (audit.trustScore || audit.score || 0), 0
                ) / auditHistory.length
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditHistoryTimeline;

// Made with Bob