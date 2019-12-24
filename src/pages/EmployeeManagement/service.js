import request from '@/utils/request';

export async function queryEmployeeList(params) {
  return request(`/api/1/employee/2/${params.page}/${params.pageSize}`,{
    method: 'POST',
    data: { ...params.data },
  });
}

export async function createEmployee(params) {
  return request(`/api/1/employee/`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function queryDepartmentList(){
  return request('/api/1/dept')
}