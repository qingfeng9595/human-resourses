import { Button, Table, Modal, Form, Icon, Badge, message, Input, Tooltip, Divider } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import SearchForm from '@/components/SearchForm';
import style from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class ApplyForm extends React.Component {
  render() {
    const { visible, type, handleAgree, handleAgreeVisible,form,record } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 15,
      },
    };
    const { getFieldDecorator } = this.props.form;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        fieldsValue.flowNodeOpinion = type
        fieldsValue.overtimeId = record.id
        handleAgree(fieldsValue);
      });
    };
    return (
      <Modal
        destroyOnClose
        title="流程审批"
        visible={visible}
        onOk={okHandle}
        onCancel={() => handleAgreeVisible(false)}
      >
        <Form layout="horizontal">
          <FormItem label="审批意见" {...formItemLayout}>
            {getFieldDecorator('flowNodeDescription', {
              initialValue: type == 1 ? '同意' : '',
              rules: [
                {
                  required: type == 1 ? false : true,
                  message: '审批意见不能为空！',
                },
              ],
            })(<TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@connect(({ overtimeApply, loading }) => ({
  overtimeApply,
  loading: loading.models.overtimeApply,
}))
export default class AppliedProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      type: '',
      visible: false,
      fields:{}
    };
  }
  SearchSubmit = fields => {
    console.log(fields);

    this.setState({
      fields,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'overtimeApply/fetchAppliedList',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        data: {
          startTime:fields.date && fields.date[0] ? moment(fields.date[0]).format('YYYY-MM-DD') : '',
          endTime: fields.date && fields.date[1] ? moment(fields.date[1].format('YYYY-MM-DD')) : '',
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
  handleAgreeVisible = (flag, type, record) => {
    if (flag) {
      this.setState({
        visible: !!flag,
        type,
        record,
      });
    } else {
      this.setState({
        visible: !!flag,
      });
    }
  };
  handleAgree=fields=>{
    console.log(fields);
    const { dispatch } = this.props
    dispatch({
      type:'overtimeApply/saveApply',
      payload:fields
    }).then(()=>{
      const {
        overtimeApply:{status}
      } = this.props
      if(status == 200){
        message.success("提交成功！")
        this.handleAgreeVisible(false)
        this.SearchSubmit(this.state.fields);
      }else{
        message.error("提交失败！")
      }
    })
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'overtimeApply/fetchAppliedList',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        data: {},
      },
    });
  }
  render() {
    const {
      overtimeApply: { list, total },
      loading,
    } = this.props;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const columns = [
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
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:ss')}</span>,
      },
      {
        title: '下班时间',
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:ss')}</span>,
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
        render: val => {
          if (val) {
            <Tooltip title={val}>
              <a>鼠标移入查看</a>
            </Tooltip>;
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
      {
        title: '操作',
        dataIndex: 'option',
        align: 'center',
        render: (_, record) => {
          if(record.status === 0){
            return<>
            <a
              onClick={() => {
                this.handleAgreeVisible(true, 1, record);
              }}
            >
              同意
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.handleAgreeVisible(true, 2, record);
              }}
            >
              不同意
            </a>
          </>
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
      //   label: '申请人工号',
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
    const applyFormProps = {
      type: this.state.type,
      record: this.state.record,
      visible: this.state.visible,
      handleAgree: this.handleAgree,
      handleAgreeVisible: this.handleAgreeVisible,
    };
    return (
      <div className={style.overtimeApply}>
        <div className={style.searchForm}>
          <SearchForm formList={formList} styles={style} SearchSubmit={this.SearchSubmit} />
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={this.handleRowKey}
          pagination={pagination}
        />
        <ApplyForm {...applyFormProps} />
      </div>
    );
  }
}
