import request from '@/utils/request'

export function getPark(data: any) {
    return request({
        url: '/parking/getParkData',
        method: 'get',
        params: data
    })
}

// 新增
export function addParking(data: any) {
    return request({
        url: `/parking/addParkData?parkname=${data.parkname}&parkpay=${data.parkpay}&parktype=${data.parktype}&parkstatus=${data.parkstatus}&token=${data.token}`,
        method: 'post',
        data
    })
}
// 修改
export function editParking(data: any) {
    return request({
        url: `/parking/editParkData?u_id=${data.u_id}&parkname=${data.parkname}&parkpay=${data.parkpay}&parktype=${data.parktype}&parkstatus=${data.parkstatus}&token=${data.token}`,
        method: 'post',
        data
    })
}
// 删除
export function delParking(data: any) {
    return request({
        url: '/parking/delParkData',
        method: 'get',
        params: data
    })
}

// 获取用户数据
export function getUser(data: any) {
    return request({
        url: '/users/getUsersData',
        method: 'get',
        params: data
    })
}

// 更新车位状态
export function updateParkStatus(data: any) {
    return request({
        url: `/users/updateParkStatus?u_id=${data.u_id}&parkId=${data.parkId}&parkname=${data.parkname}&parkstatus=${data.parkstatus}&token=${data.token}`,
        method: 'POST',
        data: data
    })
}

