import fetch from 'utils/fetch';

export function loginByEmail(email, password) {
  const data = {
    username: email,
    passwd:password
  };
  return fetch({
    url: '/CommonApi/api/GetCommonData/login',
    method: 'post',
    data
  });
}

export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}

