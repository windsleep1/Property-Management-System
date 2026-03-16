import axios from "axios";

// 使用Vercel的Serverless Function作为代理
const proxyUrl = '/api/proxy';

const server = axios.create({
    // baseURL: "http://community.byesame.com",
    // baseURL: proxyUrl + apiBaseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    }
})

//请求拦截器
server.interceptors.request.use((config: any) => {
    // if (!config.url.includes("login")) { 
    //     config.headers.token = localStorage.getItem("token")
    // }
    // return config
    
    // 构建代理请求URL
    config.url = `${proxyUrl}?path=${encodeURIComponent(config.url)}`;
    
    if (!config.url.includes("login")) { 
        config.headers.token = localStorage.getItem("token")
    }
    return config

})

// 响应拦截器
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
    return Promise.reject(error);
  }
);

export default server