import request from '@/utils/request';

export async function queryOvertimeApplyList(params) {
  return request(`/api/1/overtime/sub/${params.page}/${params.pageSize}`,{
    method: 'POST',
    data: { ...params.data },
  });
}

export async function saveOvertimeApply(params) {
  return request(`/api/1/overtime/agree/`,{
    method: 'POST',
    data: { ...params },
  });
}


export async function queryEmployeeList(params) {
  return request(`/api/1/employee/${params.page}/${params.pageSize}`,{
    method: 'POST',
    data: { ...params.data },
  });
}