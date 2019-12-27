import { queryRoleList, createRule, queryRuleList, updateRule, deleteRule } from '../service';
import { message } from 'antd';
const RulesConfigModel = {
  namespace: 'rulesConfig',
  state: {
    list: [],
    total: 0,
    roleList: [],
    workTimeList:[]
  },
  effects: {
    *fetchRuleList(_, { call, put }) {
      const response = yield call(queryRuleList);
      console.log(response);
      if (response.rtnCode === 200) {
        yield put({
          type: 'save',
          payload: response.data.ruleRespList,
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
      yield put({
        type: 'saveSuccess',
        payload: response,
      });
    },
    *deleteRule({ payload }, { call, put }) {
      const response = yield call(deleteRule, payload);
      console.log(response);
      yield put({
        type: 'saveSuccess',
        payload: response,
      });
    },
    *createRule({ payload }, { call, put }) {
      const response = yield call(createRule, payload);
      console.log(response);
      yield put({
        type: 'saveSuccess',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      console.log(action.payload[1]);
      
      const list = action.payload[0].ruleRespList.map(item => {
        item.ruleConfigItem = JSON.parse(item.ruleConfigItem)
        item = {
          name: item.name,
          id: item.id,
          ruleConfigId: item.ruleConfigId,
          ...item.ruleConfigItem
        }
        return item
      })
      const workTimeList = action.payload[1].ruleRespList.map(item => {
        item.ruleConfigItem = JSON.parse(item.ruleConfigItem)
        item = {
          name: item.name,
          id: item.id,
          ruleConfigId: item.ruleConfigId,
          ...item.ruleConfigItem
        }
        return item
      })
      return { ...state, workTimeList: workTimeList || [], list: list || [] };
    },
    saveRole(state, action) {
      action.payload.list.map(item => {
        item.deptName = item.roleName
      })
      return { ...state, roleList: action.payload.list || [] };
    },
    saveSuccess(state, action) {
      return { ...state, status: action.payload.rtnCode }
    }
  }
}
export default RulesConfigModel;