import request from '@/utils/request'

export function changePassword(data:any) {
    return request({
        url: `/users/updatePwd?id=${data.id}&oldPwd=${data.oldPwd}&newPwd=${data.newPwd}&token=${data.token}`,
        method: 'post',
        data: data
    })  
}