import request from '@/utils/request'

export function getOrder(data:any) {
    return request({
        url: '/parking/getParkOrder',
        method: 'get',
        params: data
    })  
}

// 缴费
export function updatepayOrder(data:any) {
    return request({
        url: `/parking/payParkOrder?u_id=${data.u_id}&orderstatus=${data.orderstatus}&reply=${data.reply}&token=${data.token}`,
        method: 'post',
        data: data
    })
}

// 通知
export function notifyOrder(data:any) {
    return request({
        url: `/parking/editParkOrder?u_id=${data.u_id}&startdate=${data.startdate}&enddate=${data.enddate}&orderpay=${data.orderpay}&orderstatus=${data.orderstatus}&note=${data.note}&token=${data.token}`,
        method: 'post',
        data: data
    })
}