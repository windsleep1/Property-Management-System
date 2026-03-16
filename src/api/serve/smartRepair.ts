import request from '@/utils/request'

export function getRepair(data:any) {
    return request({
        url: '/poster/getRepairData',
        method: 'get',
        params: data
    })  
}

// 获取个人数据
export function getPersonalData(data:any) {
    return request({
        url: `/users/getMyId?id=${data.id}&token=${data.token}`,
        method: 'POST',
        data: data
    })  
}

// 提交申请
export function submitApply(data:any) {
    return request({
        url: `/poster/addRepair?homename=${data.homename}&housename=${data.housename}&repairtype=${data.repairtype}&repaircontent=${data.repaircontent}&token=${data.token}`,
        method: 'post',
        data: data
    })  
}

// 删除申请
export function deleteApply(data:any) {
    return request({
        url: '/poster/delRepair',
        method: 'get',
        params: data
    })  
}


// 处理提交
export function dealApply(data:any) {
    return request({
        url: `/poster/updateSmartRepair?r_id=${data.r_id}&homename=${data.homename}&housename=${data.housename}&repaircontent=${data.repaircontent}&resultcontent=${data.resultcontent}&resultstatus=${data.resultstatus}&token=${data.token}`,
        method: 'POST',
        data: data
    })  
}