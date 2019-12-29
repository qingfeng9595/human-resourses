import request from '@/utils/request';

export async function queryAttendanceMonthSumList() {
  return request(`/api/1/attendance/getAttendanceMonthSum/`);
}

