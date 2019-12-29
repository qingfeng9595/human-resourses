import request from '@/utils/request';

export async function queryRecordList(params) {
  return request(`/api/1/attendance/sub/${params.page}/${params.size}`, {
    method: 'POST',
    data: { ...params.data },
  });
}
