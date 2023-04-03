import instance from '../base';

//上传图片
export function addPhoto(data) {
  return instance.post('flower/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
//获取全部图片信息
export function photoDetails() {
  return instance({
    url: '/flower',
    method: 'get',
  });
}

//通过id获取图片信息
export function photoDetail(fid) {
  return instance({
    url: '/flower/getFlowerById',
    method: 'get',
    params: {
      fid,
    },
  });
}
