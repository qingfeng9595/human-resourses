import { queryEmployeeList, createEmployee } from '../service';
import { message } from 'antd';
const RecordListModel = {
  namespace: 'employeeList',
  state: {
    list: [],
    total: 0,
  },
  effects: {
    *fetchEmployeeList({ payload }, { call, put }) {
      const response = yield call(queryEmployeeList, payload);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *createEmployee({ payload }, { call, put }) {
      const response = yield call(createEmployee, payload);
      console.log(response);
      if (response.rtnCode === 200) {
        message.success('创建成功！');
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, list: action.payload.employeeRespList || [], total: action.payload.total };
    }
  }
}
export default RecordListModel;