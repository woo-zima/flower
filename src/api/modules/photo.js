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
//通过月份获取图片
export function photoDetailByTime(moon) {
  return instance({
    url: '/flower/getFlowerByTime',
    method: 'get',
    params: {
      moon,
    },
  });
}

//获取品种类型
export function getTagOptions() {
  return instance({
    url: '/tag',
    method: 'get',
  });
}
//按花品种/赏花地址搜索
export function getFlowerBykey(key) {
  return instance({
    url: '/flower/getFlowerBykey',
    method: 'get',
    params: {
      keyword: key,
    },
  });
}
//兴趣推荐
export function getFlowerByTag(ftag, fid) {
  return instance({
    url: '/flower/getFlowerByTag',
    method: 'get',
    params: {
      ftag,
      fid,
    },
  });
}
