const axios = require('axios');
const NodeCache = require('node-cache');

// Rick and Morty API configuration
const API_CONFIG = {
  BASE_URL: 'https://rickandmortyapi.com/api',
  ENDPOINTS: {
    CHARACTERS: '/character',
    EPISODES: '/episode',
    LOCATIONS: '/location'
  },
  CACHE_TTL: 300, // 5 minutes
  REQUEST_TIMEOUT: 10000 // 10 seconds
};

// Create cache instance
const cache = new NodeCache({
  stdTTL: API_CONFIG.CACHE_TTL,
  checkperiod: 60 // Check for expired keys every 60 seconds
});

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Rick-and-Morty-Explorer/1.0.0'
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);

    // Handle specific error cases
    if (error.response?.status === 404) {
      error.message = 'Resource not found';
    } else if (error.response?.status === 500) {
      error.message = 'Rick and Morty API server error';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - Rick and Morty API is slow';
    } else if (error.code === 'ENOTFOUND') {
      error.message = 'Network error - Cannot reach Rick and Morty API';
    }

    return Promise.reject(error);
  }
);

// Generic API request function with caching
const makeRequest = async (endpoint, params = {}, useCache = true) => {
  // Create cache key from endpoint and params
  const cacheKey = `${endpoint}_${JSON.stringify(params)}`;

  // Check cache first
  if (useCache) {
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log(`📦 Cache hit: ${endpoint}`);
      return cachedResult;
    }
  }

  try {
    const response = await apiClient.get(endpoint, { params });
    const data = response.data;

    // Cache the result
    if (useCache) {
      cache.set(cacheKey, data);
      console.log(`💾 Cached result: ${endpoint}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ API request failed: ${endpoint}`, error.message);
    throw error;
  }
};

// Character-specific API functions
const getCharacters = async (page = 1, filters = {}) => {
  const params = { page, ...filters };
  return makeRequest(API_CONFIG.ENDPOINTS.CHARACTERS, params);
};

const getCharacterById = async (id) => {
  return makeRequest(`${API_CONFIG.ENDPOINTS.CHARACTERS}/${id}`);
};

const getMultipleCharacters = async (ids) => {
  const idsString = Array.isArray(ids) ? ids.join(',') : ids;
  return makeRequest(`${API_CONFIG.ENDPOINTS.CHARACTERS}/${idsString}`);
};

// Episode-specific API functions
const getEpisodes = async (page = 1, filters = {}) => {
  const params = { page, ...filters };
  return makeRequest(API_CONFIG.ENDPOINTS.EPISODES, params);
};

const getEpisodeById = async (id) => {
  return makeRequest(`${API_CONFIG.ENDPOINTS.EPISODES}/${id}`);
};

const getMultipleEpisodes = async (ids) => {
  const idsString = Array.isArray(ids) ? ids.join(',') : ids;
  return makeRequest(`${API_CONFIG.ENDPOINTS.EPISODES}/${idsString}`);
};

// Location-specific API functions
const getLocations = async (page = 1, filters = {}) => {
  const params = { page, ...filters };
  return makeRequest(API_CONFIG.ENDPOINTS.LOCATIONS, params);
};

const getLocationById = async (id) => {
  return makeRequest(`${API_CONFIG.ENDPOINTS.LOCATIONS}/${id}`);
};

// Utility functions
const extractIdFromUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/(\d+)$/);
  return match ? parseInt(match[1]) : null;
};

const extractIdsFromUrls = (urls) => {
  if (!Array.isArray(urls)) return [];
  return urls.map(extractIdFromUrl).filter(id => id !== null);
};

// Cache management functions
const clearCache = () => {
  cache.flushAll();
  console.log('🗑️ Cache cleared');
};

const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize
  };
};

// Health check function
const healthCheck = async () => {
  try {
    const response = await apiClient.get('/character/1');
    return {
      status: 'healthy',
      responseTime: response.headers['x-response-time'] || 'unknown',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  API_CONFIG,
  apiClient,
  makeRequest,

  // Character functions
  getCharacters,
  getCharacterById,
  getMultipleCharacters,

  // Episode functions
  getEpisodes,
  getEpisodeById,
  getMultipleEpisodes,

  // Location functions
  getLocations,
  getLocationById,

  // Utility functions
  extractIdFromUrl,
  extractIdsFromUrls,

  // Cache functions
  clearCache,
  getCacheStats,

  // Health check
  healthCheck
};
