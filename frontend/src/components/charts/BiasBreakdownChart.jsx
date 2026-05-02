/**
 * BiasBreakdownChart Component
 * 
 * Displays a bar chart showing the breakdown of different bias types detected
 * in the AI model analysis. Uses IBM Carbon Charts for consistent styling.
 * 
 * Features:
 * - Color-coded bars based on severity (Red/Orange/Yellow/Green)
 * - Responsive design
 * - Empty state handling
 * - Smooth animations
 */

import { SimpleBarChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import './BiasBreakdownChart.css';

function BiasBreakdownChart({ biasData }) {
  // Transform bias data for Carbon Charts format
  const chartData = biasData?.map(item => ({
    group: item.type || item.category,
    value: item.percentage || item.score || 0
  })) || [];

  // Chart configuration options
  const options = {
    title: 'Bias Detection Breakdown',
    axes: {
      left: {
        mapsTo: 'value',
        title: 'Risk Level (%)',
        domain: [0, 100]
      },
      bottom: {
        mapsTo: 'group',
        scaleType: 'labels',
        title: 'Bias Type'
      }
    },
    height: '350px',
    toolbar: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    color: {
      scale: {
        'Demographic': '#da1e28',  // Red - Critical
        'Gender': '#ff832b',       // Orange - High
        'Age': '#f1c21b',          // Yellow - Medium
        'Geographic': '#24a148',   // Green - Low
        'Socioeconomic': '#ff832b',
        'Cultural': '#f1c21b',
        'Language': '#24a148'
      }
    },
    bars: {
      maxWidth: 50
    },
    grid: {
      x: {
        enabled: false
      },
      y: {
        enabled: true
      }
    }
  };

  // Empty state
  if (!biasData || biasData.length === 0) {
    return (
      <div className="bias-chart-container">
        <div className="bias-chart-empty">
          <h4>Bias Detection Breakdown</h4>
          <p>No bias data available. Run a scan to see results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bias-chart-container">
      <SimpleBarChart data={chartData} options={options} />
      <div className="bias-chart-legend">
        <div className="legend-item">
          <span className="legend-color critical"></span>
          <span className="legend-label">Critical (70-100%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color high"></span>
          <span className="legend-label">High (40-69%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color medium"></span>
          <span className="legend-label">Medium (20-39%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color low"></span>
          <span className="legend-label">Low (0-19%)</span>
        </div>
      </div>
    </div>
  );
}

export default BiasBreakdownChart;

// Made with Bob