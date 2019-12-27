import { queryDepartmentList, createDepartment, queryEmployeeList, updateDepartment } from '../service';
import { message } from 'antd';
const DepartmentListModel = {
  namespace: 'departmentList',
  state: {
    list: [],
    total: 0,
    deptList: [],
    employeeList: []
  },
  effects: {
    *fetchDepartmentList(_, { call, put }) {
      const response = yield call(queryDepartmentList);
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
      if (response.rtnCode === 200) {
        message.success('创建成功！');
      }
    },
    *updateDepartment({ payload }, { call, put }) {
      const response = yield call(updateDepartment, payload);
      yield put({
        type: 'saveSuccess',
        payload: response,
      });

    },
    *fetchEmployeeList(_, { call, put }) {
      const response = yield call(queryEmployeeList);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveEmployee',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, list: action.payload.deptRespList || [], total: action.payload.total };
    },
    saveEmployee(state, action) {
      action.payload.employeeRespList.map(item => {
        item.deptName = item.name
      })
      return { ...state, employeeList: action.payload.employeeRespList || [] };
    },
    saveSuccess(state, action) {
      return { ...state, status: action.payload.rtnCode }
    }
  }
}
export default DepartmentListModel;