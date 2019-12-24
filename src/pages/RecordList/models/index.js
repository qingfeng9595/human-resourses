import { queryRecordList, updateRule, addRule, removeRule } from '../service';
const RecordListModel = {
  namespace: 'recordList',
  state: {
    list: [],
    total:0,
  },
  effects: {
    *fetchRecordList({ payload }, { call, put }) {
      const response = yield call(queryRecordList, payload);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      action.payload.attendanceRespList.map(item=>{
        item.date = item.startTime
      })
      return { ...state, list: action.payload.attendanceRespList || [],total:action.payload.total };
    }
  }
}
export default RecordListModel;