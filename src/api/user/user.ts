import request from '@/utils/request'

export function getUsersByTypePage(data:any) {
    return request({
        url: '/users/getUsersByTypePage',
        method: 'get',
        params: data
    })  
}

export function getUsersByTypeChar(data:any) {
    return request({
        url: '/admin/getUserByTypeChar',
        method: 'get',
        params: data
    })  
}

// 新增用户
export function addUser(data:any) {
    return request({
        url: `/users/addUserData?username=${data.username}&password=${data.password}&nickname=${data.nickname}&sex=${data.sex}&homeaddress=${data.homeaddress}&type=${data.type}&email=${data.email}&note=${data.note}$token=${data.token}`,
        method: 'post',
        data
    })  
}

// 编辑用户信息
export function updateUser(data:any) {
    return request({
        url: `/users/upUserData?u_id=${data.u_id}&username=${data.username}&password=${data.password}&nickname=${data.nickname}&sex=${data.sex}&homeaddress=${data.homeaddress}&type=${data.type}&email=${data.email}&note=${data.note}&token=${data.token}`,
        method: 'post',
        data
    })  
}

// 删除用户
export function deleteUser(data:any) {
    return request({
        url: `/users/delUserData`,
        method: 'GET',
        params: data
    })  
}