import { queryDepartmentList, createDepartment } from '../service';
import { message } from 'antd';
const DepartmentListModel = {
  namespace: 'departmentList',
  state: {
    list: [],
    total: 0,
    deptList:[]
  },
  effects: {
    *fetchDepartmentList(_, { call, put }) {
      const response = yield call(queryDepartmentList);
      console.log(response);
      // if (response.rtnCode === 200) {
      //   yield put({
      //     type: 'save',
      //     payload: response.data,
      //   });
      // }
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
      return { ...state, list: action.payload.employeeRespList || [], total: action.payload.total };
    }
  }
}
export default DepartmentListModel;