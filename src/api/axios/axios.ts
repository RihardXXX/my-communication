import axios, { AxiosRequestConfig } from 'axios';
import localStorage from '@/storage';

// console.log('localStorage: ', localStorage);

// базовый путь
const axiosApp = axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    baseURL: 'http://localhost:3000/',
    // baseURL: 'http://127.0.0.1:5173/'
    // baseURL: 'https://rickandmortyapi.com/api'
});

// Интерсептор для отслеживания состояния авторизации на сервере при каждом запросе
axiosApp.interceptors.request.use(async (config: AxiosRequestConfig) => {
    // const token = localStorage.getItem('token'); // получаем токен из локалсториджа
    const storage = await localStorage;
    console.log('storage: ', storage);
    const token = await storage.get('token');
    console.log('token: ', token);
    const authorizationToken: string | undefined = token
        ? `token ${token}`
        : ''; // формируем токен в виде строки
    if (authorizationToken) {
        // @ts-ignore
        config.headers.Authorization = authorizationToken; // положили в хедеры токен
    }
    return config;
});

export default axiosApp;
