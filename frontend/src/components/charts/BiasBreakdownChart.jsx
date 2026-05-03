/**
 * BiasBreakdownChart Component
 * 
 * Displays a bar chart showing the breakdown of different bias types detected
 * in the AI model analysis. Uses IBM Carbon Charts for consistent styling.
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

  // Helper to get color based on value (matching the legend)
  const getLevelColor = (value) => {
    if (value >= 70) return '#da1e28'; // Critical (Red)
    if (value >= 40) return '#ff832b'; // High (Orange)
    if (value >= 20) return '#f1c21b'; // Medium (Yellow)
    return '#24a148'; // Low (Green)
  };

  // Generate a dynamic color scale mapping each group to its severity color
  const dynamicColorScale = {};
  chartData.forEach(item => {
    dynamicColorScale[item.group] = getLevelColor(item.value);
  });

  // Chart configuration options
  const options = {
    title: 'Bias Detection Breakdown',
    theme: 'g100',
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
    toolbar: { enabled: false },
    legend: { enabled: false },
    color: {
      scale: dynamicColorScale
    },
    bars: { maxWidth: 50 },
    grid: {
      x: { enabled: false },
      y: { enabled: true }
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