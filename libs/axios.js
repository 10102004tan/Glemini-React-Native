import { API_URL } from '@/configs/api.config';
import axios from 'axios';
const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  timeout: 60000, // Tăng timeout lên 60 giây cho các request AI
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.log('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.log('❌ API Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    // handle token expired
    if (error.response?.status === 401 && error.response?.data?.message === 'expired') {
      console.log('path', error.config.url);
      console.log('expired token, trying to refresh...', error.response?.data?.message);
      if (error.config.url === '/v2/auth/refresh-token') {
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [
          {
            text: 'OK',
            onPress: async () => {
              await SecureStore.deleteItemAsync('Authorization');
              await SecureStore.deleteItemAsync('refreshToken');
              await SecureStore.deleteItemAsync('x-client-id');
              // return to login screen
              router.replace('/(auth)/login');
            },
          },
        ]);
      } else {
        try {
          const response = await api.post('/v2/auth/refresh-token');
          const { accessToken, refreshToken } = response.data.metadata;
          await SecureStore.setItemAsync('Authorization', accessToken);
          await SecureStore.setItemAsync('refreshToken', refreshToken);
          api.defaults.headers.common['Authorization'] = accessToken;
          api.defaults.headers.common['x-refresh-token'] = refreshToken;

          // retry the original request with new token
          error.config.headers['Authorization'] = accessToken;
          error.config.headers['x-refresh-token'] = refreshToken;
          return api.request(error.config);
        } catch (error) {}
      }
      // console.log("abc")
      // await SecureStore.deleteItemAsync('Authorization');
      // await SecureStore.deleteItemAsync('refreshToken');
      // await SecureStore.deleteItemAsync('x-client-id');
    }
    return Promise.reject(error);
  },
);

export default api;
