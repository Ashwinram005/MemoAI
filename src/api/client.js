import axios from 'axios';

const BASE_URL = 'https://svc-01kc5n5d8pekxmxk6zwx6k49p5.01kc1ygbvk6eye2t9pkjnv5bqz.lmapp.run';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUserId = () => localStorage.getItem('userId');

// Request logging interceptor
apiClient.interceptors.request.use(
    (config) => {
        config.metadata = { startTime: new Date() }; // Track start time

        const method = config.method.toUpperCase();
        const url = config.url;
        const fullUrl = `${config.baseURL || ''}${url}`;

        console.groupCollapsed(`%c🚀 API Request: ${method} ${url}`, 'color: #3b82f6; font-weight: bold;');
        console.log(`%cFull URL:`, 'font-weight: bold; color: #64748b;', fullUrl);
        console.log(`%cMethod:`, 'font-weight: bold; color: #64748b;', method);

        if (config.params) {
            console.log(`%cParams:`, 'font-weight: bold; color: #64748b;', config.params);
        }

        if (config.data) {
            console.log(`%cBody:`, 'font-weight: bold; color: #64748b;', config.data);
        }

        console.log(`%cHeaders:`, 'font-weight: bold; color: #64748b;', config.headers);
        console.groupEnd();

        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response logging interceptor
apiClient.interceptors.response.use(
    (response) => {
        const { config } = response;
        const duration = config.metadata ? new Date() - config.metadata.startTime : 0;
        const method = config.method.toUpperCase();
        const url = config.url;
        const status = response.status;

        const statusColor = status >= 200 && status < 300 ? '#22c55e' : '#eab308';

        console.groupCollapsed(`%c✅ API Response: ${status} ${method} ${url} (%c${duration}ms%c)`, `color: ${statusColor}; font-weight: bold;`, 'color: #64748b; font-weight: normal;', `color: ${statusColor}; font-weight: bold;`);
        console.log(`%cStatus:`, 'font-weight: bold; color: #64748b;', `${status} ${response.statusText}`);
        console.log(`%cData:`, 'font-weight: bold; color: #64748b;', response.data);
        console.log(`%cConfig:`, 'font-weight: bold; color: #64748b;', config);
        console.groupEnd();

        return response;
    },
    (error) => {
        const { config, response } = error;
        const duration = config?.metadata ? new Date() - config.metadata.startTime : 0;
        const method = config?.method?.toUpperCase() || 'UNKNOWN';
        const url = config?.url || 'UNKNOWN';
        const status = response?.status || 'ERR';

        console.groupCollapsed(`%c🚨 API Error: ${status} ${method} ${url} (%c${duration}ms%c)`, 'color: #ef4444; font-weight: bold;', 'color: #64748b; font-weight: normal;', 'color: #ef4444; font-weight: bold;');

        if (response) {
            console.log(`%cStatus:`, 'font-weight: bold; color: #64748b;', status);
            console.log(`%cServer Data:`, 'font-weight: bold; color: #64748b;', response.data);
        }

        console.log(`%cMessage:`, 'font-weight: bold; color: #64748b;', error.message);
        console.log(`%cFull Error:`, 'font-weight: bold; color: #64748b;', error);
        console.groupEnd();

        return Promise.reject(error);
    }
);

export default apiClient;
