import axios from "axios";

// 使用环境变量设置API基础URL
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://community.byesame.com";

const server = axios.create({
    // baseURL: "http://community.byesame.com",
    baseURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    }
})

server.interceptors.request.use((config: any) => {
    if (!config.url.includes("login")) { 
        config.headers.token = localStorage.getItem("token")
    }
    return config
})

server.interceptors.response.use(
  (response: any) => {  // 
    if (response.status >= 200 && response.status < 300) {
      // 1. 检查是否有jwt_token
      if (response.data && response.data.jwt_token) {
        return response.data;
      }
      
      // 2. 其他成功响应直接返回数据
      return response.data;
    }
    // 二进制数据直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response.data;
    }
    // 非2xx状态码视为错误
    return Promise.reject(response);
  },
  (error: any) => {  
    // 处理网络错误或服务器错误
    // 如果是HTTPS请求失败，尝试使用HTTP请求
    if (error.message.includes('Network Error') && baseURL.startsWith('https://')) {
      console.log('HTTPS请求失败，尝试使用HTTP请求');
      const httpURL = baseURL.replace('https://', 'http://');
      const httpServer = axios.create({
        baseURL: httpURL,
        timeout: 5000,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
      });
      
      // 复制原始请求配置
      const originalRequest = error.config;
      originalRequest.baseURL = httpURL;
      
      // 重新发送请求
      return httpServer(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default server