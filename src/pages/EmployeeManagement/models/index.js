import { queryEmployeeList, createEmployee, queryDepartmentList, updateEmployee } from '../service';
const EmployeeListModel = {
  namespace: 'employeeList',
  state: {
    list: [],
    total: 0,
    deptList: []
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
    *createEmployee({ payload, callback }, { call, put }) {
      const response = yield call(createEmployee, payload);
      yield put({
        type: 'saveSuccess',
        payload: response,
      });
      if (callback) callback();
    },
    *updateEmployee({ payload, callback }, { call, put }) {
      const response = yield call(updateEmployee, payload);
      yield put({
        type: 'saveSuccess',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchDepartmentList({ }, { call, put }) {
      const response = yield call(queryDepartmentList);
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
    saveDept(state, action) {
      return { ...state, deptList: action.payload.deptRespList || [] }
    },
    saveSuccess(state, action) {
      return { ...state, status: action.payload.rtnCode }
    }
  }
}
export default EmployeeListModel;