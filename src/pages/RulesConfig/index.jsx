import { Button, Divider, Dropdown, Form, Icon, Menu, message, Table, Badge } from 'antd';
import React, { useState, Fragment } from 'react';
import SearchForm from '@/components/SearchForm'
import { connect } from 'dva';
import moment from 'moment';
import style from './index.less'


@connect(({ rulesConfig, loading }) => ({
  rulesConfig,
  loading: loading.models.rulesConfig,
}))
export default class RulesConfig extends React.Component{
  constructor(props){
    super(props)
    this.state = {}
  }
  componentDidMount(){
    const { dispatch } = this.props
    dispatch({
      type:'rulesConfig/fetchRuleList'
    })
  }
  render(){
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        align: 'center',
      },
      {
        title: '部门主管',
        dataIndex: 'leader',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        align: 'center',
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.handleUpdateVisible(true, record);
              }}
            >
              编辑
            </a>
            {/* <Divider type="vertical" /> */}
            {/* <a>删除</a> */}
          </span>
        ),
      },
    ];
    const {
      rulesConfig: { list },
      loading,
    } = this.props;
    // const updateEmployeeProps = {
    //   title: this.state.title,
    //   updateVisible: this.state.updateVisible,
    //   employeeList: employeeList,
    //   record: this.state.record,
    //   handleUpdateVisible: this.handleUpdateVisible,
    //   handleUpdateDepartment: this.handleUpdateDepartment,
    // };
    return(
      <div className={style.rulesConfigLayout}>
      {/* <div className={style.create}>
        <Button
          type="primary"
          icon="plus"
          style={{ marginLeft: 8 }}
          onClick={() => this.handleCreateVisible(true)}
        >
          新建部门
        </Button>
      </div> */}
      <Table
        columns={columns}
        dataSource={list}
        loading={loading}
        rowKey={this.handleRowKey}
        className={style.departmentList}
      />
      {/* <UpdateDepartment {...updateEmployeeProps} /> */}
    </div>
    )
  }
}