import request from '@/utils/request';

export async function updateRule(params) {
  return request(`/api/rule/${params.ruleConfigId}/${params.id}?baseConfig=${encodeURI(JSON.stringify(params.baseConfig), 'utf-8')}&name=${params.name}`, {
    method: 'PUT',
    dataType:'json'
  });
}

export async function deleteRule(params) {
  return request(`/api/rule/${params.ruleConfigId}/${params.id}`, {
    method: 'DELETE',
  });
}

export async function createRule(params) {
  return request(`/api/rule/${params.ruleConfigId}?baseConfig=${encodeURI(JSON.stringify(params.baseConfig), 'utf-8')}&name=${params.name}`, {
    method: 'POST',
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