import { queryAppliedList, queryEmployeeList, queryApplyOpinion} from '../service';
const AppliedListModel = {
  namespace: 'appliedList',
  state: {
    list: [],
    total: 0,
    deptList: [],
    opList:[]
  },
  effects: {
    *fetchAppliedList({ payload }, { call, put }) {
      const response = yield call(queryAppliedList, payload);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
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
    saveOpinion(state, action) {
      return { ...state, opList: action.payload.list || [] }
    },
  }
}
export default AppliedListModel;