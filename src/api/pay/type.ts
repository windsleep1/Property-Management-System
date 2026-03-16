import request from '@/utils/request'

export function getPay(data:any) {
    return request({
        url: '/cost/getCostData',
        method: 'get',
        params: data
    })  
}

// 详情
export function getPayDetail(data:any) {
    return request({
        url: '/cost/getCostDetail',
        method: 'get',
        params: data
    })  
}

// 新增
export function addPay(data:any) {
    return request({
        url: `/cost/addCostData?payname=${data.payname}&paylevel=${data.paylevel}&paynum=${data.paynum}$paymoney=${data.paymoney}&paystatus=${data.paystatus}&c_id=${data.c_id}&paycontent=${data.paycontent}&coststatus=${data.coststatus}&token=${data.token}`,  
        method: 'post',
        data
    })
}