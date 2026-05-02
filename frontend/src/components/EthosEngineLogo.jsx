import React from 'react';
import './EthosEngineLogo.css';

/**
 * EthosEngine Logo Component
 * Professional logo with shield and checkmark symbolizing trust and integrity
 * Follows IBM Carbon Design System principles
 */
function EthosEngineLogo({ size = 'medium', variant = 'full', className = '' }) {
  const sizes = {
    small: { width: 24, height: 24, fontSize: '12px' },
    medium: { width: 32, height: 32, fontSize: '14px' },
    large: { width: 48, height: 48, fontSize: '20px' },
    xlarge: { width: 64, height: 64, fontSize: '24px' }
  };

  const dimensions = sizes[size] || sizes.medium;

  // Logo only (icon)
  if (variant === 'icon') {
    return (
      <svg
        className={`ethos-logo-icon ${className}`}
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="EthosEngine Logo"
      >
        {/* Shield outline */}
        <path
          d="M16 2L6 6V14C6 20.5 10 25.5 16 28C22 25.5 26 20.5 26 14V6L16 2Z"
          stroke="#0f62fe"
          strokeWidth="2"
          fill="none"
          className="logo-shield"
        />
        {/* Checkmark */}
        <path
          d="M12 16L15 19L21 13"
          stroke="#42be65"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-check"
        />
        {/* Inner accent */}
        <circle
          cx="16"
          cy="16"
          r="8"
          stroke="#0f62fe"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
          className="logo-accent"
        />
      </svg>
    );
  }

  // Full logo with text
  return (
    <div className={`ethos-logo-full ${className}`}>
      <svg
        className="ethos-logo-icon"
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="EthosEngine Logo"
      >
        {/* Shield outline */}
        <path
          d="M16 2L6 6V14C6 20.5 10 25.5 16 28C22 25.5 26 20.5 26 14V6L16 2Z"
          stroke="#0f62fe"
          strokeWidth="2"
          fill="none"
          className="logo-shield"
        />
        {/* Checkmark */}
        <path
          d="M12 16L15 19L21 13"
          stroke="#42be65"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-check"
        />
        {/* Inner accent */}
        <circle
          cx="16"
          cy="16"
          r="8"
          stroke="#0f62fe"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
          className="logo-accent"
        />
      </svg>
      <span className="ethos-logo-text" style={{ fontSize: dimensions.fontSize }}>
        EthosEngine
      </span>
    </div>
  );
}

export default EthosEngineLogo;

// Made with Bob