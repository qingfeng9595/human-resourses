import { Button, Divider, Dropdown, Form, Icon, Menu, message, Table, Badge } from 'antd';
import React, { useState, Fragment } from 'react';
import SearchForm from '@/components/SearchForm'
import { connect } from 'dva';
import moment from 'moment';
import style from './index.less'

export default class RulesConfig extends React.Component{
  // constructor(props){
  //   super(props)
  //   this.state = {}
  // }
  render(){
    return(
      <div>规则配置</div>
    )
  }
}