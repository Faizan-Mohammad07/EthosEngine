/**
 * ReportPage Component Tests
 * Tests for the comprehensive audit report page
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportPage from './ReportPage';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Carbon components
vi.mock('@carbon/react', () => ({
  Grid: ({ children }) => <div className="grid">{children}</div>,
  Column: ({ children }) => <div className="column">{children}</div>,
  Button: ({ children, onClick, renderIcon: Icon, ...props }) => (
    <button onClick={onClick} {...props}>
      {Icon && <Icon />}
      {children}
    </button>
  ),
  Tag: ({ children, type }) => <span className={`tag-${type}`}>{children}</span>,
  Modal: ({ children, open, onRequestClose, modalHeading, primaryButtonText, onRequestSubmit }) => 
    open ? (
      <div className="modal">
        <h2>{modalHeading}</h2>
        {children}
        <button onClick={onRequestSubmit}>{primaryButtonText}</button>
        <button onClick={onRequestClose}>Close</button>
      </div>
    ) : null,
  Loading: () => <div>Loading...</div>,
}));

// Mock child components
vi.mock('./TrustScoreGauge', () => ({
  default: ({ score }) => <div data-testid="trust-score-gauge">Score: {score}</div>,
}));

vi.mock('./charts/BiasBreakdownChart', () => ({
  default: ({ biasData }) => <div data-testid="bias-chart">Bias Chart: {biasData.length} items</div>,
}));

vi.mock('./charts/RiskFactorBreakdown', () => ({
  default: ({ riskFactors }) => <div data-testid="risk-chart">Risk Chart: {riskFactors.length} items</div>,
}));

// Sample scan results for testing
const mockScanResults = {
  score: 75,
  riskLevel: 'green',
  timestamp: '2026-05-03T08:00:00Z',
  modelName: 'Test Model v1.0',
  biasAnalysis: {
    score: 25,
    reasoning: 'Low bias detected across all categories',
  },
  safetyAnalysis: {
    score: 20,
    reasoning: 'Minimal safety concerns identified',
  },
  dataIngredients: ['Public Datasets', 'Synthetic Data'],
  riskFactors: [],
  biasBreakdown: [
    { type: 'Demographic', percentage: 15 },
    { type: 'Gender', percentage: 10 },
  ],
};

const mockScanResultsFailed = {
  ...mockScanResults,
  score: 35,
  riskLevel: 'red',
  biasAnalysis: {
    score: 65,
    reasoning: 'High bias detected',
  },
  safetyAnalysis: {
    score: 70,
    reasoning: 'Significant safety concerns',
  },
};

describe('ReportPage', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
    });

    it('displays empty state when no scan results', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={null} onBack={onBack} />);
      expect(screen.getByText(/No scan results available/i)).toBeInTheDocument();
    });

    it('renders all main sections', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Nutrition Label/i)).toBeInTheDocument();
      expect(screen.getByText(/Deep-Dive Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Remediation Roadmap/i)).toBeInTheDocument();
    });
  });

  describe('Executive Summary', () => {
    it('displays trust score gauge', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      const gauge = screen.getByTestId('trust-score-gauge');
      expect(gauge).toBeInTheDocument();
      expect(gauge).toHaveTextContent('Score: 75');
    });

    it('shows correct audit status for passed score', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText('Passed')).toBeInTheDocument();
    });

    it('shows correct audit status for failed score', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResultsFailed} onBack={onBack} />);
      
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    it('displays metadata correctly', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText('Test Model v1.0')).toBeInTheDocument();
      expect(screen.getByText(/Comprehensive Analysis/i)).toBeInTheDocument();
    });
  });

  describe('AI Nutrition Label', () => {
    it('displays data ingredients', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText('Public Datasets')).toBeInTheDocument();
      expect(screen.getByText('Synthetic Data')).toBeInTheDocument();
    });

    it('shows no critical risks for high score', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/No critical risks identified/i)).toBeInTheDocument();
    });

    it('shows risk factors for low score', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResultsFailed} onBack={onBack} />);
      
      expect(screen.getByText(/Bias detected in demographic categories/i)).toBeInTheDocument();
    });
  });

  describe('Deep-Dive Analysis', () => {
    it('renders bias breakdown chart', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      const chart = screen.getByTestId('bias-chart');
      expect(chart).toBeInTheDocument();
    });

    it('displays safety metrics', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/Toxicity Score/i)).toBeInTheDocument();
      expect(screen.getByText(/PII Leakage Risk/i)).toBeInTheDocument();
      expect(screen.getByText(/Hate Speech Detection/i)).toBeInTheDocument();
    });

    it('shows Granite insights', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/IBM Granite Guardian Insights/i)).toBeInTheDocument();
      expect(screen.getByText(/Low bias detected across all categories/i)).toBeInTheDocument();
    });
  });

  describe('Remediation Roadmap', () => {
    it('shows no remediation for high scores', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/Excellent Performance/i)).toBeInTheDocument();
      expect(screen.getByText(/No critical remediation steps required/i)).toBeInTheDocument();
    });

    it('shows remediation steps for low scores', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResultsFailed} onBack={onBack} />);
      
      expect(screen.getByText(/Balance training data/i)).toBeInTheDocument();
      expect(screen.getByText(/Add content filtering/i)).toBeInTheDocument();
    });

    it('displays compliance checklist', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/Regulatory Compliance Status/i)).toBeInTheDocument();
      expect(screen.getByText('EU AI Act')).toBeInTheDocument();
      expect(screen.getByText('ISO/IEC 42001')).toBeInTheDocument();
      expect(screen.getByText('NIST AI RMF')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('calls onBack when back button clicked', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      const backButton = screen.getByText(/Back to Dashboard/i);
      fireEvent.click(backButton);
      
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Export Options', () => {
    it('renders export buttons', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/Share Report/i)).toBeInTheDocument();
      expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
    });

    it('opens share modal when share button clicked', async () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      const shareButton = screen.getByText(/Share Report/i);
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Share Audit Report/i)).toBeInTheDocument();
      });
    });

    it('shows loading state during PDF generation', async () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      const exportButton = screen.getByText(/Export PDF/i);
      fireEvent.click(exportButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Generating.../i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('buttons are keyboard accessible', () => {
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeVisible();
      });
    });
  });

  describe('Responsive Design', () => {
    it('renders on mobile viewport', () => {
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
    });

    it('renders on tablet viewport', () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;
      
      const onBack = vi.fn();
      render(<ReportPage scanResults={mockScanResults} onBack={onBack} />);
      
      expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
    });
  });
});

// Made with Bob