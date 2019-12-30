import { queryAttendanceMonthSumList, queryAttendanceDeptSumList } from '../service';
import { message } from 'antd';
const DashboardModel = {
  namespace: 'dashboard',
  state: {
    monthList: [],
    total: 0,
    deptList: [],
    deptPieList: [],
    pieList:[]
  },
  effects: {
    *fetchAttendanceMonthSumList(_, { call, put }) {
      const response = yield call(queryAttendanceMonthSumList);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *fetchAttendanceDeptSumList({ payload }, { call, put }) {
      const response = yield call(queryAttendanceDeptSumList, payload);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveDept',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      for(let i = 3;i>0;i--){
        action.payload.attendanceMonthRespList.unshift({
          month:`2019-0${i}`,
          sumOverTime:0,
          sumExchangeTime:0
        })
      }
      let overtime = {name:'实际加班工时'}
      let exchangeTime = { name: '换算加班工时' }
      action.payload.attendanceMonthRespList.map(item=>{
        overtime[item.month] = item.sumOverTime
        exchangeTime[item.month] = item.sumExchangeTime
      })
      let pieList = action.payload.attendanceMonthRespList.filter(item=>{
        return item.sumOverTime >0
      })
      return { ...state, monthList: [overtime, exchangeTime] || [], pieList: pieList };
    },
    saveDept(state, action){
      let list = action.payload.attendanceDeptRespList.filter(item => {
        return item.sumOverTime > 0
      })
      let overtime = { name: '实际加班工时' }
      let exchangeTime = { name: '换算加班工时' }
      list.map(item=>{
        overtime[item.deptName] = item.sumOverTime
        exchangeTime[item.deptName] = item.sumExchangeTime
      })
      return { ...state, deptList: [overtime, exchangeTime] || [],deptPieList:list};
    }
  }
}
export default DashboardModel;
