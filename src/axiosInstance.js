import axios from 'axios';
import app from './firebase-config';
import { 
    getAuth, 
  } from 'firebase/auth';
const auth = getAuth(app);
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_NEW, // Your API base URL
});
export const getUserToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null; 
};
// Request interceptor to attach the token to requests
if (process.env.REACT_APP_AUTHTYPE_SAML === 'true') {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const user = auth.currentUser;
      if (user) {
        const token = sessionStorage.getItem('saml_authToken');
        config.headers.Authorization = `Bearer ${token}`;
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
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
