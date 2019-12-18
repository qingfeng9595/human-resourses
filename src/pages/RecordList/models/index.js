import { queryRecordList, updateRule, addRule, removeRule } from '../service';
const RecordListModel = {
  namespace: 'recordList',
  state: {
    list: {},
  },
  effects: {
    *fetchRecordList({payload}, { call, put }) {
      console.log('in');
      
      const response = yield call(queryRecordList,payload);
      // console.log(response);
      
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers:{
    save(state, action){
      return { ...state, list: action.payload || {} };
    }
  }
}
export default RecordListModel;