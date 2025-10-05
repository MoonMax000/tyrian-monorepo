import { getCookie } from '@/utils/cookie';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API || 'https://stocks-api.tyriantrade.com/api',
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API || 'https://authservice.tyriantrade.com/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie('csrftoken');

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    } else {
      console.warn('Token is missing.');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.log(error);

//     if (error.response && error.response.status === 401) {
//       removeCookie('access-token');

//       if (window.location.pathname !== '/') {
//         window.location.href = '/';
//       }
//     }

//     return Promise.reject(error);
//   },
// );
