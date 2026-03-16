import request from '@/utils/request'

export function getHouse(data:any) {
    return request({
        url: '/house/gethouseList',
        method: 'get',
        params: data
    })  
}

// 搜索
export function searchHouse(data:any) {
    return request({
        url: '/house/searchnumList',
        method: 'get',
        params: data
    })  
}

// 批量删除
export function deleteHouse(data:any) {
    return request({
        url: '/house/delnumList',
        method: 'GET',
        params: data
    })  
}

// 获取详情
export function getDetail(data:any) {
    return request({
        url: '/house/getDetailId',
        method: 'get',
        params: data
    })
}

// 编辑
export function editHouse(data:any) {
    return request({
        url: `/house/updatenumList?id=${data.id}&unitname=${data.unitname}&buildnum=${data.buildnum}&storeynum=${data.storeynum}&homenum=${data.homenum}&homename=${data.homename}&homestatus=${data.homestatus}&homemessage=${data.homemessage}&homesuggestion=${data.homesuggestion}&airnum=${data.airnum}&wifiname=${data.wifiname}&washnum=${data.washnum}&smartstatus=${data.smartstatus}&homedesk=${data.homedesk}&homechair=${data.homechair}&homeclothes=${data.homeclothes}&familystatus=${data.familystatus}&h_id=${data.h_id}&homeaddress=${data.homeaddress}&token=${data.token}`,
        method: 'post',
        data: data
    })
}