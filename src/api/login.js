import fetch from 'utils/fetch';

export function loginByEmail(email, password) {
  const data = {
    username: email,
    passwd: password
  };
  return fetch({
    url: '/CommonApi/api/GetCommonData/login',
    method: 'post',
    data
  });
}

export function logout() {
  return fetch({
    url: '/CommonApi/api/Logout',
    method: 'post'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/CommonApi/api/GetUserInfo',
    method: 'get',
    params: { token }
  });
}

