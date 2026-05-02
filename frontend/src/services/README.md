# Services Directory

This directory contains service modules for API communication and utility functions.

## Planned Services

### 1. api.js
API client for backend communication:
- Axios configuration
- Base URL setup
- Request/response interceptors
- Error handling
- API endpoints:
  - `POST /api/scan` - Trigger AI audit scan
  - Future endpoints as needed

## API Service Structure

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Usage Example

```javascript
import apiClient from './services/api';

// Trigger scan
const scanAI = async (prompt) => {
  try {
    const response = await apiClient.post('/api/scan', { prompt });
    return response;
  } catch (error) {
    console.error('Scan failed:', error);
    throw error;
  }
};
```

## Environment Variables

Create a `.env` file in the frontend root:
```
VITE_API_BASE_URL=http://localhost:8000