import request from '@/utils/request'

export function getFeedBack(data:any) {
    return request({
        url: '/poster/getFeedBack',
        method: 'get',
        params: data
    })  
}

// 添加
export function addFeedBack(data:any) {
    return request({
        url: `/poster/addFeedBack?username=${data.username}&feedtext=${data.feedtext}&token=${data.token}`,
        method: 'post',
        data: data
    })  
}

// 删除
export function deleteFeedBack(data:any) {
    return request({
        url: '/poster/delFeedback',
        method: 'get',
        params: data
    })  
}

// 批量删除
export function batchDeleteFeedBack(data:any) {
    return request({
        url: '/poster/delFeedbackData',
        method: 'GET',
        params: data
    })  
}

// 回复
export function replyFeedBack(data:any) {
    return request({
        url: `/poster/updateFeedback?f_id=${data.f_id}&feedresult=${data.feedresult}&feedstatus=${data.feedstatus}&token=${data.token}`,
        method: 'post',
        data: data
    })  
}