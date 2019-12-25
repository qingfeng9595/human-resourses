import request from '@/utils/request';

export async function queryRecordList(params) {
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