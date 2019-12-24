import { queryEmployeeList, createEmployee,queryDepartmentList } from '../service';
import { message } from 'antd';
const EmployeeListModel = {
  namespace: 'employeeList',
  state: {
    list: [],
    total: 0,
    deptList:[]
  },
  effects: {
    *fetchEmployeeList({ payload }, { call, put }) {
      const response = yield call(queryEmployeeList, payload);
      // console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *createEmployee({ payload }, { call, put }) {
      const response = yield call(createEmployee, payload);
      // console.log(response);
      if (response.rtnCode === 200) {
        message.success('创建成功！');
      }
    },
    *fetchDepartmentList({}, { call, put }) {
      const response = yield call(queryDepartmentList);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveDept',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, list: action.payload.employeeRespList || [], total: action.payload.total };
    },
    saveDept(state, action){
      return { ...state,deptList:action.payload.deptRespList||[]}
    }
  }
}
export default EmployeeListModel;