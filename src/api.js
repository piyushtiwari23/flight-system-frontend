/**
 * @fileoverview API configuration and interceptors
 * Sets up axios instance with base URL and authentication interceptors
 */

import axios from 'axios'

// Logger utility for API calls
const apiLogger = {
    info: (message, data = {}) => {
        console.log(`[API][INFO] ${message}`, data);
    },
    error: (message, error) => {
        console.error(`[API][ERROR] ${message}`, error);
    },
    debug: (message, data = {}) => {
        console.debug(`[API][DEBUG] ${message}`, data);
    }
};

const API = axios.create({
    baseURL: 'http://localhost:1221/api',
    timeout: 10000, // 10 second timeout
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        apiLogger.debug('Making API request', { 
            url: config.url, 
            method: config.method,
            hasToken: !!token 
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        apiLogger.error('Request interceptor error', error);
        return Promise.reject(error);
    }
);

// Response interceptor
API.interceptors.response.use(
    (response) => {
        apiLogger.debug('API response received', {
            url: response.config.url,
            status: response.status,
            dataLength: response.data ? JSON.stringify(response.data).length : 0
        });
        return response;
    },
    (error) => {
        apiLogger.error('API request failed', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default API;