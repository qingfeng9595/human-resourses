import request from '@/utils/request';

export async function updateRule(params) {
  console.log(params);
  
  return request(`/api/rule/${params.ruleConfigId}/${params.id}?baseConfig=${JSON.stringify(params.baseConfig)}&name=${params.name}`, {
    method: 'PUT',
    dataType:'json'
  });
}

export async function queryRuleList(){
  return request('/api/rule/list')
}

export async function queryRoleList(){
  return request('/api/1/role')
}

export async function queryEmployeeList(params) {
  return request(`/api/1/employee/1/200`, {
    method: 'POST',
    data: { ...params },
  });
}