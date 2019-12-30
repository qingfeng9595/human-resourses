import { Button, Table, Col, Form, Badge, Modal, message, Input, Tooltip } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import SearchForm from '@/components/SearchForm';
import style from './index.less';

@connect(({ appliedList, loading }) => ({
  appliedList,
  loading: loading.models.appliedList,
}))
export default class AppliedProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
    };
  }
  SearchSubmit = fields => {
    console.log(fields);

    this.setState({
      fields,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'appliedList/fetchAppliedList',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        data: {
          startTime:fields.date && fields.date[0] ? moment(fields.date[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: fields.date && fields.date[1] ? moment(fields.date[1].format('YYYY-MM-DD HH:mm:ss3')) : '',
          status:fields.status=='00'?"":fields.status,
          // jobNumber:fields.jobNumber
        },
      },
    });
  };
  onShowSizeChange = (current, pageSize) => {
    this.setState(
      {
        pageSize,
      },
      () => {
        this.SearchSubmit(this.state.fields);
      },
    );
  };
  onShowPageChange = (current, pageSize) => {
    this.setState(
      {
        page: current,
      },
      () => {
        this.SearchSubmit(this.state.fields);
      },
    );
  };
  handleRowKey = (record, i) => {
    return record.startTime + i;
  };
  handleViewOpinion=record=>{
    const { dispatch } = this.props
    dispatch({
      type:'appliedList/fetchApplyOpinion',
      payload:record
    }).then(()=>{
      const { appliedList :{opList}} = this.props
      Modal.info({
        title: '审批意见',
        content: (
          <div>
            <p>{opList[1].flowNodeDescription}</p>
          </div>
        ),
        onOk() { },
        okText:'知道了'
      });
    })
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appliedList/fetchAppliedList',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        data: {},
      },
    });
  }
  render() {
    const {
      appliedList: { list, total },
      loading,
    } = this.props;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const columns = [
      // {
      //   title: '流程类型',
      //   dataIndex: 'processName',
      //   key: 'processName',
      //   align: 'center',
      // },
      {
        title: '部门',
        dataIndex: 'deptName',
        key: 'deptName',
        align: 'center',
      },
      {
        title: '申请人',
        dataIndex: 'employeeName',
        key: 'name',
        align: 'center',
      },
      {
        title: '工号',
        dataIndex: 'jobNumber',
        key: 'jobNumber',
        align: 'center',
      },
      {
        title: '上班时间',
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '下班时间',
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '加班时长',
        dataIndex: 'overtime',
        key: 'overtime',
        align: 'center',
      },
      {
        title: '申请原因',
        dataIndex: 'overtimeReason',
        key: 'overtimeReason',
        align: 'center',
        render: val => (
          <Tooltip title={val}>
            <a>移入查看</a>
          </Tooltip>
        ),
      },
      {
        title: '审批意见',
        dataIndex: 'opinion',
        key: 'opinion',
        align: 'center',
        render: (val,record) => {
          if(record.status != 0){
            return <a onClick={()=>this.handleViewOpinion(record)}>查看</a>
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: text => {
          switch (text) {
            case 1:
              return <Badge status="success" text="同意" />;
              break;
            case 2:
              return <Badge status="warning" text="不同意" />;
              break;
            default:
              return <Badge status="warning" text="未审批" />;
              break;
          }
        },
      },
    ];
    const formList = [
      {
        key: 'b',
        type: 'Range',
        label: '日期',
        field: 'date',
        // initialValue: {
        //   start: moment(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`)),
        //   end: moment(new Date())
        // },
      },
      {
        key: 'e',
        type: 'Select',
        label: '状态',
        field: 'status',
        initialValue: '00',
        placeholder: '请选择',
        list: [
          { id: '00', deptName: '全部' },
          { id: '0', deptName: '待审批' },
          { id: '1', deptName: '同意' },
          { id: '2', deptName: '不同意' },
        ],
      },
      // {
      //   key: 'd',
      //   type: 'Input',
      //   label: '员工工号',
      //   field: 'jobNumber',
      //   placeholder: '请输入',
      // },
    ];
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.state.pageSize,
      current: this.state.page,
      total: total,
      showTotal: total => `Total ${total} 条`,
      onChange: this.onShowPageChange,
      onShowSizeChange: this.onShowSizeChange,
    };
    console.log(list);

    return (
      <div className={style.applyProcess}>
        <div className={style.searchForm}>
          <SearchForm formList={formList} styles={style} SearchSubmit={this.SearchSubmit} />
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
    );
  }
}
