import { Button, message, Select, Form, Modal, Table, Divider, Input } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import SearchForm from '@/components/SearchForm';
import moment from 'moment';
import style from './index.less';
import { updateDepartment } from './service';
import { getEmployeeOptionList } from '@/utils/utils';
const FormItem = Form.Item;

@Form.create()
class UpdateDepartment extends React.Component {
  handleOk = () => {
    const { form, handleUpdateDepartment, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.id = record.id;
      fieldsValue.parentDeptId = 0
      handleUpdateDepartment(fieldsValue);
    });
  };
  render() {
    const { title, updateVisible, handleUpdateVisible, employeeList, record } = this.props;
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
          <FormItem label="部门" {...formItemLayout}>
            {getFieldDecorator('deptName', {
              initialValue: record.deptName,
              rules: [
                {
                  required: true,
                  message: '部门不能为空',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="部门主管" {...formItemLayout}>
            {getFieldDecorator('leaderId', {
              initialValue: record.leaderId,
            })(
              <Select
                placeholder="请选择"
                showSearch
                optionFilterProp="children"
              >
                {getEmployeeOptionList(employeeList)}
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@connect(({ departmentList, loading }) => ({
  departmentList,
  loading: loading.models.departmentList,
}))
export default class DepartmentManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      page: 1,
      title: '',
      updateVisible: false,
      record: {},
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/fetchDepartmentList',
    });
    dispatch({
      type: 'departmentList/fetchEmployeeList',
      payload: {},
    });
  }
  handleRowKey = (record, i) => {
    return record.id;
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
  handleUpdateVisible = (flag, record) => {
    if (record) {
      this.setState({
        updateVisible: !!flag,
        title: '编辑',
        record,
      });
    } else {
      this.setState({
        updateVisible: !!flag,
      });
    }
  };
  handleUpdateDepartment = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/updateDepartment',
      payload: fields
    }).then(() => {
      const {
        departmentList: { status },
        dispatch
      } = this.props
      if (status === 200) {
        message.success('更新成功！')
        this.handleUpdateVisible(false)
        dispatch({
          type: 'departmentList/fetchDepartmentList',
        });
      }else{
        message.error('更新失败！')
      }
    })
  };
  render() {
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        align: 'center',
      },
      {
        title: '部门主管',
        dataIndex: 'employeeName',
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
      departmentList: { list, employeeList },
      loading,
    } = this.props;
    const updateEmployeeProps = {
      title: this.state.title,
      updateVisible: this.state.updateVisible,
      employeeList: employeeList,
      record: this.state.record,
      handleUpdateVisible: this.handleUpdateVisible,
      handleUpdateDepartment: this.handleUpdateDepartment,
    };
    return (
      <div className={style.departmentLayout}>
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
        <UpdateDepartment {...updateEmployeeProps} />
      </div>
    );
  }
}
