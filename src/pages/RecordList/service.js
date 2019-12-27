import request from '@/utils/request';

export async function queryRecordList(params) {
  console.log(params.data);
  
  return request(`/api/1/attendance/${params.page}/${params.size}`, {
    method: 'POST',
    data: { ...params.data },
  });
}

export async function queryExport(params) {
  return request(`/api/1/attendance/download`, {
    method: 'POST',
    responseType: 'blob',
    data: { ...params },
  });
}

export async function queryDepartmentList() {
  return request('/api/1/dept')
}

export async function queryOvertime(params) {
  return request(`/api/1/attendance/computeOverTime/${params.id}`, {
    method: 'POST',
  });
}

export async function overtimeApply(params) {
  return request(`/api/1/overtime`, {
    method: 'POST',
    data: { ...params },
  });
}