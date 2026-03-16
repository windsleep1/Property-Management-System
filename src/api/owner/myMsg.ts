import request from '@/utils/request'

export function getMy(data:any) {
    return request({
        url: `/users/getMyId?id=${data.id}&token=${data.token}`,
        method: 'POST',
        data: data
    })  
}

// 上传头像
export function uploadAvatar(token: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request({
    url: `/users/updateIcon?token=${token}`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}