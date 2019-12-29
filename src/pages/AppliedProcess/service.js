import request from '@/utils/request';

export async function queryAppliedList(params) {
  return request(`/api/1/overtime/${params.page}/${params.pageSize}`,{
    method: 'POST',
    data: { ...params.data },
  });
}

export async function queryEmployeeList(params) {
  return request(`/api/1/employee/${params.page}/${params.pageSize}`,{
    method: 'POST',
    data: { ...params.data },
  });
}