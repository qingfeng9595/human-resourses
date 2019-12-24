import { Button, Row, Col, Form, Icon, Table, Divider,Input } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import SearchForm from '@/components/SearchForm'
import moment from 'moment';
import style from './index.less'

export default class DepartmentManagement extends React.Component{
  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        align: 'center',
        render: () =>(
          <span>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        ),
      },
    ]
    return(
      <div className={style.departmentLayout}>
      <div className={style.create}>
        <Button type='primary' icon='plus' style={{ marginLeft: 8 }} onClick={()=>this.handleCreateVisible(true)}>新建部门</Button>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        loading={loading}
        rowKey={this.handleRowKey}
        pagination={pagination}
        className={style.employeeList}
      />
      <CreateEmployee  {...createEmployeeProps}/>
    </div>
    )
  }
}