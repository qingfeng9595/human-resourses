import request from '@/utils/request';


export async function updateDepartment(params) {
  return request(`/api/1/dept/${params.deptId}`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function queryRuleList(){
  return request('/api/rule/list')
}

export async function queryEmployeeList(params) {
  return request(`/api/1/employee/1/200`, {
    method: 'POST',
    data: { ...params },
  });
}