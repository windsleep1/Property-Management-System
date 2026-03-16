import request from '@/utils/request'

export function getMenu(data:any) {
    return request({
        url: '/admin/getMenuData',
        method: 'get',
        params: data
    })  
}
