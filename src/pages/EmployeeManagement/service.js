import request from '@/utils/request';

export async function queryEmployeeList(params) {
  return request(`/api/1/employee/${params.page}/${params.pageSize}`,{
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

export async function updateEmployee(params) {
  return request(`/api/1/employee/${params.id}`, {
    method: 'PUT',
    data: { ...params },
  });
}

export async function deleteEmployee(params) {
  return request(`/api/1/employee/${params.id}`, {
    method: 'PUT',
    data: { ...params },
  });
}

export async function queryDepartmentList(){
  return request('/api/1/dept')
}