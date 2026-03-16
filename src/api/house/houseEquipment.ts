import request from '@/utils/request'

export function searchList(data: any) {
    return request({
        url: '/house/searchdeviceList',
        method: 'get',
        params: data
    })
}

// 更新智能状态
export function updateSmartStatus(data: any) {
    return request({
        url: `/house/updatesmartStatus?id=${data.id}&smartstatus=${data.smartstatus}&token=${data.token}`,
        method: 'POST',
        data
    })
}
// 更新家居状态
export function updateHouseStatus(data: any) {
    return request({
        url: `/house/updatefamilyStatus?id=${data.id}&familystatus=${data.familystatus}&token=${data.token}`,
        method: 'POST',
        data
    })
}

