import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent(id) {
  return request(`/api/1/employee/?account=${id}`);
}
export async function queryNotices() {
  return request('/api/notices');
}
