import axios from 'axios';

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8001/api',
  withCredentials: true,
});

export const streamApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STREAM_API_URL || 'https://streamer.k8s.tyriantrade.com/api/v1',
  withCredentials: true,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1',
  withCredentials: true,
});

export const recomendationApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RECOMMENDATION_API_URL || 'https://recomendation.k8s.tyriantrade.com/api/v1',
  withCredentials: true,
});

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      console.log(currentPath !== '/guest');
      if (currentPath !== '/guest') {
        window.location.href = '/guest';
      }
    }

    return Promise.reject(error);
  },
);
