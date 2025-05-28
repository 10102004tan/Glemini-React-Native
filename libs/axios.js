import { API_URL } from '@/configs/api.config';
import axios from 'axios';
const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    timeout: 5000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;