import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API || 'https://cmc-api.tyriantrade.com/api/v1/',
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API || 'https://authservice.tyriantrade.com/api',
  withCredentials: true,
});
