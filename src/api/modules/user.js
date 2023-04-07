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
