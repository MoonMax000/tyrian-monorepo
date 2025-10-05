import axios from 'axios';

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API || 'https://authservice.tyriantrade.com/api',
  withCredentials: true,
});
