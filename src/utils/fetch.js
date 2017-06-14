import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
var querystring = require('querystring');
// import router from '../router';

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {  
  config.data = querystring.stringify(config.data) // axios application/x-www-form-urlencoded 无法序列化，增加序列化
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['X-Token'] = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
    * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
    * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
    */
    const code = response.data.code;
    // -10001，需要重新登录
    if (code === -10001) {
      Message({
        message: response.data && response.data.message,
        type: 'error',
        duration: 5 * 1000
      });
      // 登出
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      });
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error);// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

export default service;
