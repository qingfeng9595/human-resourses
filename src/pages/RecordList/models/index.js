import { queryRecordList, updateRule, addRule, removeRule } from '../service';
const RecordListModel = {
  namespace: 'recordList',
  state: {
    list: []
  },
  effects: {
    *fetchRecordList({ payload }, { call, put }) {
      const response = yield call(queryRecordList, payload);
      console.log(response);
      if (response.rtnCode) {
        yield put({
          type: 'save',
          payload: response.data.attendanceRespList,
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, list: action.payload || [] };
    }
  }
}
export default RecordListModel;