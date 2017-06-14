import fetch from 'utils/fetch';
/**
 * 接口设置
 */
// 获取列表
export function getApiList(listQuery) {
  return fetch({
    url: '/CommonApi/api/GetCommonData/getCommonApiList',
    method: 'get',
    params: listQuery
  });
}
