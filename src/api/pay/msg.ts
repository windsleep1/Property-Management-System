import request from '@/utils/request'

export function getPayMessage(data:any) {
    return request({
        url: '/cost/getPayMessage',
        method: 'get',
        params: data
    })  
}

// 详情
export function getPayDeatil(data:any) {
    return request({
        url: '/cost/getCostDetail',
        method: 'get',
        params: data
    })  
}

// 删除
export function deletePay(data:any) {
    return request({
        url: '/cost/delCostData',
        method: 'get',
        params: data
    })
}