import { queryAppliedList, queryEmployeeList } from '../service';
const AppliedListModel = {
  namespace: 'appliedList',
  state: {
    list: [],
    total: 0,
    deptList: []
  },
  effects: {
    *fetchAppliedList({ payload }, { call, put }) {
      const response = yield call(queryAppliedList, payload);
      console.log(response);

      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *fetchEmployeeList({ payload }, { call, put }) {
      const response = yield call(queryEmployeeList, payload);
      console.log(response);

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
      action.payload.overtimeListRespList.map(item=>{
        item.processName = '加班申请'
      })
      return { ...state, list: action.payload.overtimeListRespList || [], total: action.payload.overtimeListRespList.length };
    },
    saveEmployee(state, action) {
      // return { ...state, deptList: action.payload.deptRespList || [] }
    },
  }
}
export default AppliedListModel;