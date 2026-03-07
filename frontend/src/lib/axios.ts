import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});

axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let redirecting = false

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !redirecting
    ) {
      const path = window.location.pathname
      const isAuthPage = path === "/login" || path === "/register"
      const token = localStorage.getItem("token")

      // redirect เฉพาะตอนที่มี token แล้วยัง 401 = token หมดอายุจริงๆ
      if (!isAuthPage && token) {
        redirecting = true
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
);

export default axios;
