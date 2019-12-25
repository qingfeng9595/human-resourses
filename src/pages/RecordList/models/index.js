import { queryRecordList, queryExport } from '../service';
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
    *fetchRecordExport({ payload }, { call, put }) {
      const response = yield call(queryExport, payload);
      console.log(response);
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