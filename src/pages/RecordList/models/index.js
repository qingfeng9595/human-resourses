import { queryRecordList, queryExport, queryDepartmentList, queryOvertime, overtimeApply } from '../service';
const RecordListModel = {
  namespace: 'recordList',
  state: {
    list: [],
    total:0,
    deptList:[],
    overtime:{}
  },
  effects: {
    *fetchRecordList({ payload }, { call, put }) {
      const response = yield call(queryRecordList, payload);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *fetchOvertime({ payload }, { call, put }) {
      const response = yield call(queryOvertime, payload);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveOvertime',
          payload: response.data,
        });
      }
    },
    *fetchRecordExport({ payload }, { call, put }) {
      const response = yield call(queryExport, payload);
      let url = window.URL.createObjectURL(new Blob([response], { type: 'application/vnd.ms-excel'  }))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '员工考勤汇总' + '.xlsx')
      // link.download = '员工考勤汇总';
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href);
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
    *overtimeApply({ payload, callback }, { call, put }) {
      const response = yield call(overtimeApply, payload);
      yield put({
        type: 'saveSuccess',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      action.payload.attendanceRespList.map(item=>{
        item.date = item.startTime
      })
      return { ...state, list: action.payload.attendanceRespList || [],total:action.payload.total };
    },
    saveDept(state, action) {
      return { ...state, deptList: action.payload.deptRespList || [] }
    },
    saveOvertime(state, action){
      return { ...state, overtime: action.payload || {} }
    },
    saveSuccess(state, action) {
      return { ...state, status: action.payload.rtnCode }
    }
  }
}
export default RecordListModel;