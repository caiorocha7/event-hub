import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const register = async (username, email, password, password_confirmation) => {
  return await api.post('/auth/register', {
    username,
    email,
    password,
    password_confirmation
  });
};

export const logout = () => {
  api.post('/auth/logout');
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};