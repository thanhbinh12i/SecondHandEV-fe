/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, type AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: "https://localhost:7292/api/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        return response;
      },
      function (error) {
        if (error) {
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          if (error.response?.status === 401) {
            console.error(
              "Unauthorized - token có thể hết hạn hoặc không hợp lệ"
            );
          } else if (error.response?.status === 403) {
            console.error("Forbidden - không có quyền truy cập");
          } else {
            console.error(message);
          }
        }
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;
export default http;
