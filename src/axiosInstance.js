import axios from 'axios';
import app from './firebase-config';
import { 
    getAuth, 
  } from 'firebase/auth';
const auth = getAuth(app);
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKBONE, 
});

export const getUserToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null; 
};

if (process.env.REACT_APP_AUTHTYPE_SAML === 'true') {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = sessionStorage.getItem('saml_authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['X-Bearer'] = 'Student'
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
else if(sessionStorage.getItem('dh_guest_authToken'))
{
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = sessionStorage.getItem('dh_guest_authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['X-Bearer'] = 'Student'
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
else
{
  axiosInstance.interceptors.request.use(
    async (config) => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['X-Bearer'] = 'Alumini'
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}


export default axiosInstance;