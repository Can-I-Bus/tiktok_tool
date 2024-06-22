import axios from 'axios';
import base from '@/config/base.config';
const { BASE_URL, TIMEOUT } = base;

console.log(`http://${window.location.host}/tiktok`, '=======');
const service = axios.create({
    // baseURL: `http://localhost:9000/tiktok`,
    // baseURL: `http://192.168.0.103:9000/tiktok`,
    baseURL: `http://${window.location.host}/tiktok`,
    timeout: TIMEOUT,
});

service.interceptors.request.use(
    async (config) => {
        let token = sessionStorage.getItem('ua_jot');
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        //剥离最外层
        if (response.data.code == 401) {
            return;
        }
        return response?.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default service;
