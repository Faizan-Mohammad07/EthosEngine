/**
 * API Service - EthosEngine Frontend
 * 
 * Axios-based API client for communicating with the FastAPI backend.
 * Handles all HTTP requests, error handling, retries, and response formatting.
 * 
 * Features:
 * - Configurable base URL via environment variables
 * - Request/response interceptors
 * - Automatic retry logic for failed requests
 * - Comprehensive error handling
 * - Loading state management
 * - Request timeout configuration
 */

import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = 90000; // 90 seconds (Extended for deep IBM Granite analysis)
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Create Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Logs outgoing requests and adds any necessary headers
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });
    
    // Add timestamp to request
    config.metadata = { startTime: new Date() };
    
    // Add auth token if available (for future use)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles successful responses and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`[API Response] ${response.config.url} - ${duration}ms`, {
      status: response.status,
      data: response.data,
    });
    
    // Return the data directly for easier consumption
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error details
    console.error('[API Response Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    
    // Handle network errors with retry logic
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount < MAX_RETRIES) {
        console.log(`[API Retry] Attempt ${originalRequest._retryCount}/${MAX_RETRIES}`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * originalRequest._retryCount));
        
        return apiClient(originalRequest);
      }
    }
    
    // Format error for consistent handling
    const formattedError = formatError(error);
    return Promise.reject(formattedError);
  }
);

/**
 * Format error responses for consistent handling
 * @param {Error} error - The error object
 * @returns {Object} Formatted error object
 */
function formatError(error) {
  if (error.response) {
    // Server responded with error status
    return {
      type: 'server_error',
      status: error.response.status,
      message: error.response.data?.error?.message || error.response.data?.message || 'Server error occurred',
      details: error.response.data?.error?.details || error.response.data?.details,
      timestamp: error.response.data?.error?.timestamp || new Date().toISOString(),
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      type: 'network_error',
      message: 'Unable to connect to server. Please check your internet connection.',
      details: 'No response received from server',
      timestamp: new Date().toISOString(),
    };
  } else {
    // Error in request setup
    return {
      type: 'client_error',
      message: error.message || 'An unexpected error occurred',
      details: error.toString(),
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * API Service Object
 * Contains all API endpoint methods
 */
const apiService = {
  /**
   * Health Check
   * Verify API is running and accessible
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  },

  /**
   * Scan AI Content
   * Send content to backend for bias and safety analysis
   * @param {Object} params - Scan parameters
   * @param {string} params.content - Content to scan (user prompt or model description)
   * @param {string} [params.scanType='comprehensive'] - Type of scan (comprehensive, safety_only, bias_only)
   * @returns {Promise<Object>} Scan results
   */
  async scanContent({ content, scanType = 'comprehensive' }) {
    if (!content || typeof content !== 'string') {
      throw new Error('Content is required and must be a string');
    }

    if (content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

    if (content.length > 10000) {
      throw new Error('Content exceeds maximum length of 10,000 characters');
    }

    const validScanTypes = ['comprehensive', 'safety_only', 'bias_only'];
    if (!validScanTypes.includes(scanType)) {
      throw new Error(`Invalid scan type. Must be one of: ${validScanTypes.join(', ')}`);
    }

    try {
      const response = await apiClient.post('/api/scan', {
        content: content.trim(),
        scan_type: scanType,
      });

      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  },

  /**
   * Get API Information
   * Fetch API metadata and available endpoints
   * @returns {Promise<Object>} API information
   */
  async getApiInfo() {
    try {
      const response = await apiClient.get('/');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  },
};

/**
 * Utility function to check if API is accessible
 * @returns {Promise<boolean>} True if API is accessible
 */
export async function checkApiConnection() {
  try {
    const result = await apiService.healthCheck();
    return result.success;
  } catch (error) {
    console.error('[API Connection Check Failed]', error);
    return false;
  }
}

/**
 * Utility function to get API base URL
 * @returns {string} Current API base URL
 */
export function getApiBaseUrl() {
  return API_BASE_URL;
}

/**
 * Export the API service as default
 */
export default apiService;

// Export individual methods for convenience
export const { healthCheck, scanContent, getApiInfo } = apiService;

// Made with Bob