import axios from "axios";

const apiaxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_BE,
});

apiaxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
})

export const login = async (email: string, password: string) => {
  const response = await apiaxios.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, name: string) => {
  const response = await apiaxios.post('/users', { email, password, name });
  return response.data;
};