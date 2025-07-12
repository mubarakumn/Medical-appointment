import axios from 'axios';

const API = axios.create({
  baseURL: 'https://medical-appointment-backend-five.vercel.app/api', 
});

export const loginUser = async (email, password) => {
  const res = await API.post('/users/login', { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await API.post('/users/register', userData);
  return res.data;
};
