import { queryOvertimeApplyList, queryEmployeeList, saveOvertimeApply, queryApplyOpinion } from '../service';
const OvertimeApplyListModel = {
  namespace: 'overtimeApply',
  state: {
    list: [],
    total: 0,
    opList:[],
    deptList: []
  },
  effects: {
    *fetchAppliedList({ payload }, { call, put }) {
      const response = yield call(queryOvertimeApplyList, payload);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *saveApply({ payload, callback }, { call, put }) {
      const response = yield call(saveOvertimeApply, payload);
      yield put({
        type: 'saveSuccess',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchEmployeeList({ payload }, { call, put }) {
      const response = yield call(queryEmployeeList, payload);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveEmployee',
          payload: response.data,
        });
      }
    },
    *fetchApplyOpinion({ payload }, { call, put }) {
      const response = yield call(queryApplyOpinion, payload);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveOpinion',
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
    saveSuccess(state, action) {
      return { ...state, status: action.payload.rtnCode }
    },
    saveEmployee(state, action) {
      // return { ...state, deptList: action.payload.deptRespList || [] }
    },
    saveOpinion(state, action) {
      return { ...state, opList: action.payload.list || [] }
    },
  }
}
export default OvertimeApplyListModel;