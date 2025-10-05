import axios from 'axios';
const BASE_URL = 'https://presidio-week-3-smart-learning-platform-1.onrender.com/api';
export const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
