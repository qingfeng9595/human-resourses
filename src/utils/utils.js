import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Select } from 'antd';
const Option = Select.Option;
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

export function getOptionList(data){
  if(!data){return [];}
  let options = []; //[<Option value='0' key='all_key'>全部</Option>]
  data.map((item,i)=>{
    options.push(<Option disabled={item.disabled} value={item.id} key={Math.random()}>{item.deptName}</Option>)
  })
  return options;
}

export function getEmployeeOptionList(data) {
  if (!data) { return []; }
  let options = []; //[<Option value='0' key='all_key'>全部</Option>]
  // console.log(data);
  data.map((item) => {
    options.push(<Option disabled={item.disabled} value={item.jobNumber} key={Math.random()}>{item.deptName}</Option>)
  })
  return options;
}