import instance from '../base';

//用户登录
export function login(data) {
  return instance.post('user/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
//用户注册
export function register(data) {
  return instance.post('user/register', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
//更改个人介绍
export function upIntroduction(data) {
  return instance.post('user/upIntroduction', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
//获取你的收藏tag
export function getTagByUid(uid) {
  return instance({
    url: 'collect/getUserLikeTag',
    method: 'get',
    params: {
      uid,
    },
  });
}
//根据cname查询
export function getTagByCname(uid) {
  return instance({
    url: 'collect/getLikeByCName',
    method: 'get',
    params: {
      uid,
    },
  });
}
