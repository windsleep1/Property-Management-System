// import request from '@/utils/request'

// export function login(data:any) {
//     return request({
//         url: `/users/login?username=${data.username}&password=${data.password}`,
//         method: 'post',
//         data
//     })  
// }

import server from '@/utils/request';

export function login(data: any) {
  return server.post('/users/login', data);
}