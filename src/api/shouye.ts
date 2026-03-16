import request from '@/utils/request'

export function getAdmin(data:any) {
    return request({
        url: '/users/getUserByToken',
        method: 'get',
        params: data
    })  
}

export function getPost(data:any) {
    return request({
        url: '/poster/getPosterData',
        method: 'get',
        params: data
    })  
}

export function getUser(data:any) {
    return request({
        url: '/users/getUsersData',
        method: 'get',
        params: data
    })  
}
export function getCost(data:any) {
    return request({
        url: '/cost/getPayMessage',
        method: 'get',
        params: data
    })  
}
export function getPark(data:any) {
    return request({
        url: '/parking/getParkOrder',
        method: 'get',
        params: data
    })  
}
export function getFeedBack(data:any) {
    return request({
        url: '/poster/getFeedBack',
        method: 'get',
        params: data
    })  
}

// 小区分布
export function getHouse(data:any) {
    return request({
        url: '/house/searchList',
        method: 'get',
        params: data
    })  
}

// 车位
export function getParking(data:any) {
    return request({
        url: '/parking/getParkData',
        method: 'get',
        params: data
    })  
}

// 计费项目
export function getCostItem(data:any) {
    return request({
        url: '/cost/getCostData',
        method: 'get',
        params: data
    })  
}

// 访问
export function getVisit() {
    return request({
        url: '/users/getLoginMonth',
        method: 'get',
    })  
}
// 账户
export function getCount(data:any) {
    return request({
        url: '/users/getUsersByTypePage',
        method: 'get',
        params: data
    })  
}
// 账户搜索
export function CountSearch(data:any) {
    return request({
        url: '/admin/getUserData',
        method: 'get',
        params: data
    })  
}
