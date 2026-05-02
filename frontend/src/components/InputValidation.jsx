import React, { useState, useEffect } from 'react';
import { TextArea, FormLabel } from '@carbon/react';
import { CheckmarkFilled, WarningFilled } from '@carbon/icons-react';
import './InputValidation.css';

/**
 * InputValidation Component
 * Text input with real-time validation feedback
 * 
 * @param {string} value - Current input value
 * @param {function} onChange - Change handler
 * @param {string} label - Input label
 * @param {string} placeholder - Placeholder text
 * @param {number} minLength - Minimum character length
 * @param {number} maxLength - Maximum character length
 * @param {boolean} required - Whether input is required
 * @param {function} customValidator - Custom validation function
 * @param {boolean} showCharCount - Show character counter
 */
const InputValidation = ({
  value = '',
  onChange,
  label = 'Input',
  placeholder = 'Enter text...',
  minLength = 10,
  maxLength = 10000,
  required = true,
  customValidator,
  showCharCount = true,
  rows = 4
}) => {
  const [validationState, setValidationState] = useState({
    isValid: false,
    errors: [],
    warnings: [],
  });

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    validateInput(value);
  }, [value, minLength, maxLength, required]);

  const validateInput = (inputValue) => {
    const errors = [];
    const warnings = [];
    let isValid = true;

    // Required check
    if (required && (!inputValue || inputValue.trim().length === 0)) {
      errors.push('This field is required');
      isValid = false;
    }

    // Length checks
    if (inputValue && inputValue.trim().length > 0) {
      if (inputValue.length < minLength) {
        errors.push(`Minimum ${minLength} characters required`);
        isValid = false;
      }

      if (inputValue.length > maxLength) {
        errors.push(`Maximum ${maxLength} characters allowed`);
        isValid = false;
      }

      // Warning for approaching max length
      if (inputValue.length > maxLength * 0.9) {
        warnings.push(`Approaching character limit (${inputValue.length}/${maxLength})`);
      }
    }

    // Custom validation
    if (customValidator && inputValue) {
      const customResult = customValidator(inputValue);
      if (customResult && !customResult.isValid) {
        errors.push(customResult.message);
        isValid = false;
      }
    }

    setValidationState({ isValid, errors, warnings });
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const getInvalidText = () => {
    if (!touched || validationState.isValid) return '';
    return validationState.errors[0] || '';
  };

  const getWarnText = () => {
    if (validationState.warnings.length > 0) {
      return validationState.warnings[0];
    }
    return '';
  };

  const charCount = value.length;
  const charPercentage = (charCount / maxLength) * 100;

  return (
    <div className="input-validation">
      <TextArea
        id="validated-input"
        labelText={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        invalid={touched && !validationState.isValid}
        invalidText={getInvalidText()}
        warn={validationState.warnings.length > 0}
        warnText={getWarnText()}
        rows={rows}
        maxLength={maxLength}
      />

      {showCharCount && (
        <div className="input-validation__footer">
          <div className="input-validation__char-count">
            <span className={`char-count ${charPercentage > 90 ? 'char-count--warning' : ''}`}>
              {charCount} / {maxLength}
            </span>
            <div className="char-count-bar">
              <div 
                className={`char-count-bar__fill ${charPercentage > 90 ? 'char-count-bar__fill--warning' : ''}`}
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
          </div>

          {touched && validationState.isValid && value.length >= minLength && (
            <div className="input-validation__success">
              <CheckmarkFilled size={16} />
              <span>Valid input</span>
            </div>
          )}

          {touched && !validationState.isValid && (
            <div className="input-validation__error-icon">
              <WarningFilled size={16} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputValidation;

// Made with Bob
