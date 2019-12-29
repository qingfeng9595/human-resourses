import { queryAttendanceMonthSumList } from '../service';
import { message } from 'antd';
const DashboardModel = {
  namespace: 'dashboard',
  state: {
    monthList: [],
    total: 0,
    deptList: []
  },
  effects: {
    *fetchAttendanceMonthSumList(_, { call, put }) {
      const response = yield call(queryAttendanceMonthSumList);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *createDepartment({ payload }, { call, put }) {
      const response = yield call(createDepartment, payload);
      console.log(response);
      if (response.rtnCode === 200) {
        message.success('创建成功！');
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, monthList: action.payload.attendanceMonthRespList || [] };
    }
  }
}
export default DashboardModel;
