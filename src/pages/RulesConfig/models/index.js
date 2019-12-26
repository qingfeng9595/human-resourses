import { queryDepartmentList, createDepartment,queryRuleList } from '../service';
import { message } from 'antd';
const RulesConfigModel = {
  namespace: 'rulesConfig',
  state: {
    list: [],
    total: 0,
    deptList: []
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
    *createDepartment({ payload }, { call, put }) {
      const response = yield call(createDepartment, payload);
      console.log(response);
      if (response.rtnCode === 200) {
        message.success('创建成功！');
      }
    },
  },
  reducers: {
    save(state, action) {
      const list = action.payload.ruleRespList.map(item=>{
        item.ruleConfigItem = JSON.parse(item.ruleConfigItem)
        item = {
          ruleName: `加班规则${item.id}`,
          id:item.id,
          ruleConfigId: item.ruleConfigId,
          ...item.ruleConfigItem
        }
        return item
      })
      return { ...state, list: list || [] };
    }
  }
}
export default RulesConfigModel;