import React from 'react';
import { Button } from '@carbon/react';
import { Renew, DocumentBlank, WarningAlt } from '@carbon/icons-react';
import './EmptyState.css';

/**
 * EmptyState Component
 * Displays when there's no data to show
 * 
 * @param {string} type - Type of empty state: 'no-data', 'no-results', 'initial'
 * @param {string} title - Main heading
 * @param {string} description - Supporting text
 * @param {function} onAction - Optional action button callback
 * @param {string} actionLabel - Label for action button
 */
const EmptyState = ({ 
  type = 'no-data',
  title,
  description,
  onAction,
  actionLabel = 'Get Started'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'no-results':
        return <DocumentBlank size={64} />;
      case 'initial':
        return <DocumentBlank size={64} />;
      case 'no-data':
      default:
        return <WarningAlt size={64} />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'no-results':
        return {
          title: 'No Results Found',
          description: 'Try adjusting your search or filters to find what you\'re looking for.'
        };
      case 'initial':
        return {
          title: 'Ready to Scan',
          description: 'Click the scan button to analyze an AI model and view its trust score and risk factors.'
        };
      case 'no-data':
      default:
        return {
          title: 'No Data Available',
          description: 'There is currently no data to display. Please try again later.'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {getIcon()}
      </div>
      <h3 className="empty-state__title">{displayTitle}</h3>
      <p className="empty-state__description">{displayDescription}</p>
      {onAction && (
        <Button
          kind="primary"
          renderIcon={Renew}
          onClick={onAction}
          className="empty-state__action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

// Made with Bob
