import { stringify } from 'querystring';
import router from 'umi/router';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.rtnCode === 200) {
        window.sessionStorage.setItem('userId',response.data.jobNumber)
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        let token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);

        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);

        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = '/';
        //     return;
        //   }
        // }

        // router.replace(redirect || '/');
        router.replace('/');
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      let currentAuthority
      payload.data.roleListResp.list.map(item=>{
        if(item.id == 3){
          currentAuthority = "staff"
        } else if (item.id == 4){
          currentAuthority = 'leader'
        } else if (item.id == 5) {
          currentAuthority = 'admin'
        }
      })
      // let roleId = payload.data.roleListResp.list[0].id
      // switch (roleId) {
      //   case 3:
      //     currentAuthority = 'staff'
      //     break;
      //   case 4:
      //     currentAuthority = 'leader'
      //     break;
      //   case 5:
      //     currentAuthority = 'admin'
      //     break;
      //   default: currentAuthority = 'staff'
      //     break;
      // }
      setAuthority(currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
