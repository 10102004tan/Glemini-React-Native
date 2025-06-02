import axios from 'axios';
// const base_url = getWiFiIPv4() || 'http://192.168.1.246:3000';
const api = axios.create({
  withCredentials: true,
  baseURL: `${'http://10.0.168.89:3000'}/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
