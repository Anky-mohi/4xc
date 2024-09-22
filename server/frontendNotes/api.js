import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = (email, password) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const googleLogin = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const facebookLogin = () => {
  window.location.href = `${API_URL}/auth/facebook`;
};
