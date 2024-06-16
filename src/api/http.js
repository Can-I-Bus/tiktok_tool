import service from './common';
import API_LIST from '@/config/api.config';

export default async function Http({ type, data, onUploadProgress = '' }) {
    if (!(type in API_LIST)) {
        throw new Error('API请求错误');
    }
    let { url, method } = API_LIST[type];
    try {
        method = method.toLowerCase();
        data = method === 'get' ? { params: data } : data;
        let result = await service[method](url, data, onUploadProgress);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}
