import request from '@/utils/request';


export async function createDepartment(params) {
  return request(`/api/1/employee/`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function queryDepartmentList(){
  return request('/api/1/dept')
}