import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://cmc.k8s.volctrade.com/coin-market-cap/cmc',
  timeout: 10000,
});

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const refreshAuthLogic = async (failedRequest: any) => {
//   const refreshToken = localStorage.getItem('refreshToken');
//   try {
//     const { data } = await axios.post<{ token: string }>('/auth/refresh', { refreshToken });
//     localStorage.setItem('token', data.token);
//     failedRequest.response.config.headers.Authorization = `Bearer ${data.token}`;
//     return Promise.resolve();
//   } catch (error) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//     window.location.href = '/login';
//     return Promise.reject(error);
//   }
// };

// createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
//   statusCodes: [401],
// });

export default axiosInstance;
