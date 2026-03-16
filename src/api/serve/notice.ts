import request from '@/utils/request'

export function getNotice(data:any) {
    return request({
        url: '/poster/getPosterData',
        method: 'get',
        params: data
    })  
}

// 发布公告
export function addNotice(data:any) {
    return request({
        url: `/poster/addPoster?communityname=${data.communityname}&title=${data.title}&content=${data.content}&token=${data.token}`,
        method: 'POST',
        data: data
    })  
}

// 归档
export function deleteNotice(data:any) {
    return request({
        url: '/poster/delPoster',
        method: 'GET',
        params: data
    })  
}