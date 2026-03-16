import request from '@/utils/request'

export function getHouse(data:any) {
    return request({
        url: '/house/gethouseList',
        method: 'get',
        params: data
    })  
}
export function getSearch(data:any) {
    return request({
        url: '/house/searchList',
        method: 'get',
        params: data
    })  
}

// 单元详情
export function getUnitDetail(data:any) {
    return request({
        url: '/house/getDetailId',
        method: 'get',
        params: data
    })  
}

// 录入
export function addUnit(data:any) {
    return request({
        url: `/house/addunitList?communityname=${data.communityname}&unitname=${data.unitname}&unitnum=${data.unitnum}&unitstatus=${data.unitstatus}&unitcontext=${data.unitcontext}&token=${data.token}`,
        method: 'POST',
        data: data
    })  
}

// 编辑
export function editUnit(data:any) {
    return request({
        url: `/house/updateunitList?u_id=${data.u_id}&communityname=${data.communityname}&unitname=${data.unitname}&unitnum=${data.unitnum}&unitstatus=${data.unitstatus}&unitcontext=${data.unitcontext}&token=${data.token}`,        
        method: 'POST',
        data: data
    })
}

// 删除
export function deleteUnit(data:any) {
    return request({
        url: '/house/delunitList',        
        method: 'GET',
        params: data
    })
}