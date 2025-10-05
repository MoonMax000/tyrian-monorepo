import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API || 'https://market-api.tyriantrade.com/api/v1',
  withCredentials: true,
});
