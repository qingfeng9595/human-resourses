import { queryRoleList, createDepartment,queryRuleList,updateRule } from '../service';
import { message } from 'antd';
const RulesConfigModel = {
  namespace: 'rulesConfig',
  state: {
    list: [],
    total: 0,
    roleList: [],
  },
  effects: {
    *fetchRuleList(_, { call, put }) {
      const response = yield call(queryRuleList);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data.ruleRespList[0],
        });
      }
    },
    *fetchRoleList(_, { call, put }) {
      const response = yield call(queryRoleList);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveRole',
          payload: response.data,
        });
      }
    },
    *updateRule({ payload }, { call, put }) {
      const response = yield call(updateRule, payload);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'saveSuccess',
          payload: response,
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      const list = action.payload.ruleRespList.map(item=>{
        item.ruleConfigItem = JSON.parse(item.ruleConfigItem)
        item = {
          name: item.name,
          id:item.id,
          ruleConfigId: item.ruleConfigId,
          ...item.ruleConfigItem
        }
        return item
      })
      return { ...state, list: list || [] };
    },
    saveRole(state, action){
      action.payload.list.map(item=>{
        item.deptName = item.roleName
      })
      return { ...state, roleList: action.payload.list || [] };
    },
    saveSuccess(state, action){
      return { ...state, status: action.payload.rtnCode }
    }
  }
}
export default RulesConfigModel;