import axios from 'axios';
import { getToken } from './GetToken';
import { API_ENDPOINTS } from './ApiEndpoint';

const http = axios.create({
  baseURL: 'http://192.168.1.235:8000',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const accessToken = getToken();
  config.headers = {
    Authorization: `${accessToken ? accessToken : ''}`,
    ...config.headers,
  };
  return config;
});

// http.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response.status === 401) {
//       axios.post();
//     }
//   }
// );

export default http;
