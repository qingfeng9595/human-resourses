import { Button, Row, Col, Form, Select, Table, Divider, Input, Modal, DatePicker } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import SearchForm from '@/components/SearchForm';
import moment from 'moment';
import { getOptionList } from '@/utils/utils';
import style from './index.less';
const FormItem = Form.Item;

@Form.create()
class CreateEmployee extends React.Component {
  handleOk = () => {
    const { form, handleAddEmployee } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      handleAddEmployee(fieldsValue);
    });
  };
  render() {
    const { title, visible, handleCreateModalCancel,deptList } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 15,
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={handleCreateModalCancel}
      >
        <Form layout="horizontal">
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '姓名不能为空',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="工号" {...formItemLayout}>
            {getFieldDecorator('jobNumber', {
              rules: [
                {
                  required: true,
                  message: '工号不能为空',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="入职日期" {...formItemLayout}>
            {getFieldDecorator('joinDate', {
              rules: [
                {
                  required: true,
                  message: '入职日期不能为空',
                },
              ],
            })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="部门" {...formItemLayout}>
            {getFieldDecorator('deptId',{
            })(
              <Select placeholder='请选择'>
                {getOptionList(deptList)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@connect(({ employeeList, loading }) => ({
  employeeList,
  loading: loading.models.employeeList,
}))
export default class EmployeeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      visible: false,
      title: '',
      fields: {},
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeList/fetchEmployeeList',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        data: {},
      },
    });
    dispatch({
      type: 'employeeList/fetchDepartmentList',
    })
  }
  handleRowKey = (record, i) => {
    return record.id;
  };
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState(
      {
        pageSize,
        current,
      },
      () => {
        this.SearchSubmit(this.state.fields);
      },
    );
  };

  SearchSubmit = fields => {
    console.log(fields);
    this.setState({
      fields,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeList/fetchEmployeeList',
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
        data: {
          startTime: fields.date[0] ? moment(fields.date[0]).format('YYYY-MM-DD') : '',
          endTime: fields.date[1] ? moment(fields.date[1].format('YYYY-MM-DD')) : '',
          ...fields,
        },
      },
    });
  };

  handleAddEmployee = fields => {
    console.log(fields);
    const { dispatch } = this.props
    dispatch({
      type:'employeeList/createEmployee',
      payload:fields
    })
  };
  handleCreateVisible = flag => {
    this.setState({
      visible: !!flag,
      title: '创建新员工',
    });
  };
  handleCreateModalCancel = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        align: 'center',
      },
      {
        title: '人员',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '工号',
        dataIndex: 'jobNumber',
        align: 'center',
      },
      {
        title: '岗位',
        dataIndex: 'jobName',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        align: 'center',
        render: () => (
          <span>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        ),
      },
    ];
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
        field: 'name',
        placeholder: '请输入',
      },
      {
        key: 'a',
        type: 'Input',
        label: '所属部门',
        field: 'deptId',
        placeholder: '请输入',
        // list: [{ key: '0', itemName: '全部' }, { key: '1', itemName: '部门1' }, { key: '2', itemName: '部门2' }, { key: '3', itemName: '部门3' }]
      },
      {
        key: 'd',
        type: 'Input',
        label: '员工工号',
        field: 'jobNumber',
        placeholder: '请输入',
      },
    ];
    const {
      employeeList: { list, total,deptList },
      loading,
    } = this.props;
    
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.state.pageSize,
      current: this.state.current,
      total: total,
      showTotal: total => `Total ${total} 条`,
      onChange: this.onShowSizeChange,
    };
    const createEmployeeProps = {
      title: this.state.title,
      visible: this.state.visible,
      deptList:deptList,
      handleCreateModalCancel: this.handleCreateModalCancel,
      handleAddEmployee: this.handleAddEmployee,
    };
    return (
      <div className={style.employeeLayout}>
        <div className={style.searchForm}>
          <SearchForm formList={formList} styles={style} SearchSubmit={this.SearchSubmit} />
        </div>
        <div className={style.create}>
          <Button
            type="primary"
            icon="plus"
            style={{ marginLeft: 8 }}
            onClick={() => this.handleCreateVisible(true)}
          >
            新建员工
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={this.handleRowKey}
          pagination={pagination}
          className={style.employeeList}
        />
        <CreateEmployee {...createEmployeeProps} />
      </div>
    );
  }
}
