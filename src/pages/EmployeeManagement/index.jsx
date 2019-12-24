import { Button, Row, Col, Form, Icon, Table, Divider,Input } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import SearchForm from '@/components/SearchForm'
import moment from 'moment';
import style from './index.less'

@connect(({ employeeList, loading }) => ({
  employeeList,
  loading: loading.models.employeeList,
}))
export default class EmployeeManagement extends React.Component{
  constructor(props){
    super(props)
    this.state={
      page:1,
      pageSize:10
    }
  }
  componentDidMount(){
    const { dispatch } = this.props
    dispatch({
      type:'employeeList/fetchEmployeeList',
      payload:{
        page:this.state.page,
        pageSize:this.state.pageSize
      }
    })
  }
  handleRowKey = (record, i) => {
    return record.id
  }
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState({
      pageSize,
      current,
    }, () => {
      this.SearchSubmit(this.state.fields)
    })

  }
  render(){
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        align: 'center'
      },
      {
        title: '人员',
        dataIndex: 'name',
        align: 'center'
      },
      {
        title: '工号',
        dataIndex: 'jobNumber',
        align: 'center'
      },
      {
        title: '岗位',
        dataIndex: 'jobName',
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
    const formList = [
      {
        key: 'b',
        type: 'Range',
        label: '入职日期',
        field: 'date',
        // initialValue: {
        //   start: moment(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`)),
        //   end: moment(new Date())
        // },
      },
      {
        key: 'c',
        type: 'Input',
        label: '员工姓名',
        field: 'employeeName',
        placeholder: '请输入',
      },
      {
        key: 'a',
        type: 'Select',
        label: '所属部门',
        field: 'dept_id',
        placeholder: '请选择',
        list: [{ key: '0', itemName: '全部' }, { key: '1', itemName: '部门1' }, { key: '2', itemName: '部门2' }, { key: '3', itemName: '部门3' }]
      },
      {
        key: 'd',
        type: 'Input',
        label: '员工工号',
        field: 'member',
        placeholder: '请输入',
      },
      {
        key: 'f',
        type: 'Input',
        label: '员工岗位',
        field: 'jobName',
        placeholder: '请输入',
      }
    ]
    const {
      employeeList: { list,total },
      loading,
    } = this.props;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: total,
      onChange: this.onShowSizeChange
    };
    return(
      <div className={style.employeeLayout}>
        <div className={style.searchForm}>
          <SearchForm formList={formList} styles={style} SearchSubmit={this.SearchSubmit} />
        </div>
        <div className={style.create}>
          <Button type='primary' icon='plus' style={{ marginLeft: 8 }} >新建员工</Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={this.handleRowKey}
          pagination={pagination}
          className={style.employeeList}
        />
      </div>
    )
  }
}

