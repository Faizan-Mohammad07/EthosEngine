import React from 'react';
import { InlineNotification, Button } from '@carbon/react';
import { Renew, WarningAlt, ErrorFilled, Information } from '@carbon/icons-react';
import './ErrorDisplay.css';

/**
 * ErrorDisplay Component
 * Displays error messages with retry functionality
 * 
 * @param {string} type - Error severity: 'error', 'warning', 'info'
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {function} onRetry - Retry callback function
 * @param {boolean} showRetry - Whether to show retry button
 * @param {string} retryLabel - Label for retry button
 * @param {boolean} inline - Use inline notification style
 */
const ErrorDisplay = ({
  type = 'error',
  title,
  message,
  onRetry,
  showRetry = true,
  retryLabel = 'Try Again',
  inline = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <WarningAlt size={24} />;
      case 'info':
        return <Information size={24} />;
      case 'error':
      default:
        return <ErrorFilled size={24} />;
    }
  };

  const getKind = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'error':
      default:
        return 'error';
    }
  };

  if (inline) {
    return (
      <div className="error-display error-display--inline">
        <InlineNotification
          kind={getKind()}
          title={title}
          subtitle={message}
          hideCloseButton={!onRetry}
          onCloseButtonClick={onRetry}
          lowContrast
        />
        {showRetry && onRetry && (
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Renew}
            onClick={onRetry}
            className="error-display__retry-btn"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`error-display error-display--${type}`}>
      <div className="error-display__icon">
        {getIcon()}
      </div>
      <div className="error-display__content">
        <h3 className="error-display__title">{title}</h3>
        <p className="error-display__message">{message}</p>
        {showRetry && onRetry && (
          <Button
            kind="tertiary"
            renderIcon={Renew}
            onClick={onRetry}
            className="error-display__retry"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;

// Made with Bob
