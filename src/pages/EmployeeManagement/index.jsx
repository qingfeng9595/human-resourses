import { Button, message, Col, Form, Select, Table, Divider, Input, Modal, DatePicker } from 'antd';
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
        destroyOnClose
        visible={visible}
        onOk={this.handleOk}
        onCancel={()=>handleCreateModalCancel()}
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

@Form.create()
class UpdateEmployee extends React.Component {
  handleOk = () => {
    const { form, handleUpdateEmployee,record } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.joinDate = moment(fieldsValue.joinDate).format('YYYY-MM-DD')
      fieldsValue.id = record.id
      handleUpdateEmployee(fieldsValue);
    });
  };
  render() {
    const { title, updateVisible, handleUpdateVisible, deptList,record } = this.props;


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
        destroyOnClose
        visible={updateVisible}
        onOk={this.handleOk}
        onCancel={() => handleUpdateVisible()}
      >
        <Form layout="horizontal">
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: record.name,
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
              initialValue: record.jobNumber,
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
              initialValue: moment(record.joinDate),
              rules: [
                {
                  required: true,
                  message: '入职日期不能为空',
                },
              ],
            })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="部门" {...formItemLayout}>
            {getFieldDecorator('deptId', {
              initialValue: record.deptId,
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
      updateVisible:false,
      title: '',
      fields: {},
      record:{}
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
  onShowPageChange = (current) => {
    this.setState({ page:current,},
      () => {
        this.SearchSubmit(this.state.fields);
      },
    );
  };
  onShowSizeChange = (current,pageSize)=>{
    this.setState({ pageSize },
      () => {
        this.SearchSubmit(this.state.fields);
      },
    );
  }
  SearchSubmit = fields => {
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
          startTime: fields.date && fields.date[0]? moment(fields.date[0]).format('YYYY-MM-DD') : '',
          endTime: fields.date && fields.date[1]? moment(fields.date[1].format('YYYY-MM-DD')) : '',
          ...fields,
        },
      },
    });
  };

  handleAddEmployee = fields => {
    const { dispatch } = this.props
    dispatch({
      type:'employeeList/createEmployee',
      payload:fields
    }).then(()=>{
      const {
        employeeList: { status }
      } = this.props
      if (status === 200){
        message.success('创建成功！')
        this.handleCreateVisible()
        this.SearchSubmit(this.state.fields)
      }else{
        message.error('创建失败！')
      }
    })
  };
  handleCreateVisible = flag => {
    this.setState({
      visible: !!flag,
      title: '创建新员工',
    });
  };
  handleUpdateVisible = (flag,record) => {
    if(record){
      this.setState({
        updateVisible: !!flag,
        title: '编辑',
        record
      });
    }else{
      this.setState({
        updateVisible: !!flag,
      });
    }
  };
  handleUpdateEmployee=fields=>{
    const { dispatch } = this.props
    dispatch({
      type:'employeeList/updateEmployee',
      payload:fields
    }).then(()=>{
      const {
        employeeList: { status }
      } = this.props
      if (status === 200) {
        message.success('更新成功！')
        this.handleUpdateVisible(false)
        this.SearchSubmit(this.state.fields)
      }else{
        message.error('更新失败！')
      }
    })
  }

  render() {
    const {
      employeeList: { list, total, deptList },
      loading,
    } = this.props;
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        key: 'deptName',
        align: 'center',
      },
      {
        title: '人员',
        dataIndex: 'name',
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
        title: '岗位',
        dataIndex: 'jobName',
        key: 'jobName',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        align: 'center',
        render: (_,record) => (
          <span>
            <a onClick={() => { this.handleUpdateVisible(true,record)}}>编辑</a>
            {/* <Divider type="vertical" />
            <a>删除</a> */}
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
        type: 'Select',
        label: '所属部门',
        field: 'deptId',
        placeholder: '请选择',
        list:deptList
      },
      {
        key: 'd',
        type: 'Input',
        label: '员工工号',
        field: 'jobNumber',
        placeholder: '请输入',
      },
    ];
    
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.state.pageSize,
      current: this.state.page,
      total: total,
      showTotal: total => `Total ${total} 条`,
      onChange: this.onShowPageChange,
      onShowSizeChange:this.onShowSizeChange
    };
    const createEmployeeProps = {
      title: this.state.title,
      visible: this.state.visible,
      deptList:deptList,
      handleCreateModalCancel: this.handleCreateVisible,
      handleAddEmployee: this.handleAddEmployee,
    };
    const updateEmployeeProps = {
      title: this.state.title,
      updateVisible: this.state.updateVisible,
      deptList: deptList,
      record:this.state.record,
      handleUpdateVisible: this.handleUpdateVisible,
      handleUpdateEmployee: this.handleUpdateEmployee,
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
        <UpdateEmployee {...updateEmployeeProps} />
      </div>
    );
  }
}
