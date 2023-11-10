import axios from "axios";
import { getToken } from "./auth";

const BASE_URL = process.env.REACT_APP_BASE_API;
const authToken = getToken();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosFormDataInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosInstance.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axiosFormDataInstance.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const get = url => axiosInstance.get(url);
export const post = (url, data) => axiosInstance.post(url, data);
export const put = (url, data) => axiosInstance.put(url, data);
export const del = url => axiosInstance.delete(url);

export const postFormData = (url, data) => axiosFormDataInstance.post(url, data);
export const putFormData = (url, data) => axiosFormDataInstance.put(url, data);
