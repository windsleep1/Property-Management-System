// api/proxy.js
const axios = require('axios');

module.exports = async (req, res) => {
  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  try {
    // 从请求中获取目标API路径
    const path = req.query.path;
    if (!path) {
      return res.status(400).json({ error: 'Missing path parameter' });
    }

    // 构建完整的目标URL
    const targetUrl = `http://community.byesame.com${path}`;
    
    console.log('Forwarding request to:', targetUrl);
    
    // 转发请求到后端API
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        // 移除可能导致问题的头
        host: '',
        origin: '',
        referer: ''
      }
    });
    
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 返回后端API的响应
    res.status(response.status).json(response.data);
  } catch (error) {
    // 处理错误
    console.error('Proxy error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: error.message });
  }