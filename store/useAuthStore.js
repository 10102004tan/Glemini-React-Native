import { create } from 'zustand';
import api from '../libs/axios';
import * as SecureStore from 'expo-secure-store';

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  isSignedIn: false,
  signIn: async (email, password) => {
    set({ error: null });
    try {
      const response = await api.post('/v2/auth/login', {
        email,
        password,
      });
      const { tokens, user } = response.data.metadata;
      console.log('/login=>tokens::::', tokens);
      await SecureStore.setItemAsync('Authorization', tokens.accessToken);
      await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
      await SecureStore.setItemAsync('x-client-id', user.user_id);
      // set withCredentials
      api.defaults.withCredentials = true;
      api.defaults.headers.common['Authorization'] = tokens.accessToken;
      api.defaults.headers.common['x-client-id'] = user.user_id;
      set({ user, isSignedIn: true });
      return { success: true };
    } catch (error) {
      console.log('/login=>error::::', error);
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          message = 'Invalid email or password';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (error.response.status === 401) {
          message = 'Unauthorized. Please check your credentials.';
        }
      }
      return { success: false, error: message };
    }
  },
  signOut: async ({ deviceToken = null }) => {
    try {
      const body = {
        deviceToken,
      };
      const response = await api.post('/v2/auth/logout', body);
      console.log('/logout=>response::::', response.data);
      await SecureStore.deleteItemAsync('Authorization');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('x-client-id');
      set({ isSignedIn: false });
    } catch (error) {
      console.log('/logout=>error::::', error);
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (error.response.status === 401) {
          message = 'Unauthorized. Please check your credentials.';
        }
      }
      return { success: false, error: message };
    }
  },
  signUp: async ({ email, password, fullname }) => {
    try {
      // set({ isLoading: true, error: null })
      const response = await api.post('/v2/auth/signup', {
        email,
        password,
        fullname,
      });
      console.log('[STORE] signUp: => ' + response.data.metadata);
      set({ user: response.data.metadata });
      return { success: true };
    } catch (error) {
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          message = 'Invalid input. Please check your details.';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        } else if (error.response.status === 409) {
          message = 'Email already exists. Please use a different email.';
        }
      }
      return { success: false, error: message };
    }
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const authorization = await SecureStore.getItemAsync('Authorization');
      const xClientId = await SecureStore.getItemAsync('x-client-id');
      console.log('/me=>authorization::::', authorization);
      console.log('/me=>xClientId::::', xClientId);
      if (!authorization) {
        set({ isSignedIn: false, isLoading: false });
        return;
      }

      const response = await api.get('/v2/auth/me', {
        headers: {
          Authorization: `${authorization}`,
          'x-client-id': xClientId,
        },
      });
      const { metadata } = response.data;
      console.log('/me=>emetadata::::', metadata);
      // set withCredentials
      api.defaults.withCredentials = true;
      api.defaults.headers.common['Authorization'] = authorization;
      api.defaults.headers.common['x-client-id'] = xClientId;
      set({ user: metadata, isSignedIn: true, isLoading: false });
      return { success: true };
    } catch (error) {
      console.log('error', error);
      let message = 'An error occurred. Please try again.';
      if (error.message === 'Network Error') {
        throw new Error('Network Error');
      } else if (error.response.status === 500) {
        message = 'Server error. Please try again later.';
      } else if (error.response.status === 401) {
        message = 'Unauthorized. Please check your credentials.';
      } else if (error.response.status === 400) {
        message = 'Unauthorized. Please check your credentials.';
      }
      await SecureStore.deleteItemAsync('Authorization');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('x-client-id');
      return { success: false, error: message };
    }
  },
  updateInfo: async (data) => {
    set({ error: null });
    try {
      const response = await api.put('/v2/user/update', data);
      const { metadata } = response.data;
      console.log('[STORE] updateInfo: => ' + metadata);
      return { success: true };
    } catch (error) {
      console.log('[STORE] updateInfo error:', error);
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          message = 'Invalid input. Please check your details.';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        }
      }
      set({ error: message });
      return { success: false, error: message };
    }
  },
  forgotPassword: async (email) => {
    set({ error: null });
    try {
      const response = await api.post('/v1/auth/forgot-password', { email });
      console.log('[STORE] forgotPassword: => ' + response.data);
      return { success: true };
    } catch (error) {
      console.log('[STORE] forgotPassword error:', error);
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          message = 'Invalid email address.';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        }
      }
      set({ error: message });
      return { success: false, error: message };
    }
  },
  resetPassword: async (email, password,otp) => {
    set({ error: null });
    try {
      const response = await api.post('/v1/auth/reset-password', {
        email,
        password,
        otp
      });
      console.log('[STORE] resetPassword: => ' + response.data);
      return { success: true };
    } catch (error) {
      console.log('[STORE] resetPassword error:', error);
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          message = 'Invalid token or password.';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        }
      }
      set({ error: message });
      return { success: false, error: message };
    }
  },
  checkOtp: async (otp,email) => {
    set({ error: null });
    try {
      const response = await api.post('/v1/auth/verify-otp', {
        otp,
        email,
      });
      console.log('[STORE] checkOtp: => ' + response.data);
      return { success: true };
    } catch (error) {
      console.log('[STORE] checkOtp error:', error);
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          message = 'Invalid OTP.';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        }
      }
      set({ error: message });
      return { success: false, error: message };
    }
  },
  changePw: async (oldPassword, newPassword) => {
    set({ error: null });
    try {
      const response = await api.post('/v1/auth/change-password', {
        oldPassword,
        newPassword,
      });
      console.log('[STORE] changePw: => ' + response.data);
      return { success: true }; 
    } catch (error) {
      console.log('[STORE] changePw error:', error);
      let message = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          message = 'Invalid input. Please check your details.';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        }
      }
      set({ error: message });
      return { success: false, error: message };
    }
  }
}));
