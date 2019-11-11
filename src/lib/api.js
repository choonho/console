import axios from 'axios';
import VueCookies from 'vue-cookies';
import jwt from 'jsonwebtoken';

class APIError extends Error {
    constructor(axiosError) {
        super();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError);
        }

        this.name = 'APIError';
        this.status = 500;
        this.code = 'ERROR_UNKNOWN';
        this.axiosError = axiosError;

        if (axiosError.response) {
            this.status = axiosError.response.status;

            if (axiosError.response.data.error) {
                this.message = axiosError.response.data.error.message;
                this.code = axiosError.response.data.error.code;
            } else {
                this.message = axiosError.response.statusText;
            }
        } else {
            this.message = axiosError.message;
        }
    }
}

class API {
    constructor() {
        this.instance = null;
    }

    getExpireTimes(accessToken) {
        const decodedToken = jwt.decode(accessToken);
        return decodedToken.exp - Math.floor(Date.now() / 1000);
    }

    createAxiosInstance(baseURL) {
        const axiosConfig = {
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        this.instance = axios.create(axiosConfig);
        const accessToken = VueCookies.get('accessToken');
        if (accessToken) {
            this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }
    }

    setResponseInterceptor(handlers) {
        this.instance.interceptors.response.use((response) => {
            const accessToken = response.headers['access-token'];
            if (accessToken) {
                this.setAccessToken(accessToken);
            }
            return response;
        }, (e) => {
            const apiError = new APIError(e);

            if (apiError.status === 401) {
                if (handlers.authError) {
                    handlers.authError(apiError);
                }
            }

            return Promise.reject(apiError);
        });
    }

    setAccessToken(accessToken) {
        this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        const expireTimes = this.getExpireTimes(accessToken);
        VueCookies.set('accessToken', accessToken, expireTimes);
    }

    removeAccessToken() {
        if (this.instance) {
            delete this.instance.defaults.headers.common.Authorization;
        }
        VueCookies.remove('accessToken');
    }

    checkAccessToken() {
        const accessToken = VueCookies.get('accessToken');
        if (accessToken) {
            return true;
        }
        return false;
    }

    init(baseURL, handlers = {}) {
        if (!this.instance) {
            this.createAxiosInstance(baseURL);
            this.setResponseInterceptor(handlers);
        }
    }
}

export default new API();
