import request from '@/utils/request';

export async function queryEmployeeList(params) {
  // return request(`/api/1/attendance/${params.page}/${params.size}`, {
  //   method: 'POST',
  //   data: { ...params.data },
  // });
  return request(`/api/1/employee/2/${params.page}/${params.pageSize}`);
}

export async function createEmployee(params) {
  return request(`/api/1/employee/`, {
    method: 'POST',
    data: { ...params },
  });
}