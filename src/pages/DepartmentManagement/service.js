import request from '@/utils/request';

export async function createDepartment(params) {
  return request(`/api/1/employee/`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateDepartment(params) {
  return request(`/api/1/employee/`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function queryDepartmentList(){
  return request('/api/1/dept')
}

export async function queryEmployeeList(params) {
  return request(`/api/1/employee/1/200`, {
    method: 'POST',
    data: { ...params },
  });
}