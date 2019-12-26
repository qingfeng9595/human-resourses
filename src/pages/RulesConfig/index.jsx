import { Button, Divider, Modal, Form, Input, Select, message, Table, Card } from 'antd';
import React, { useState, Fragment } from 'react';
import SearchForm from '@/components/SearchForm';
import { connect } from 'dva';
import moment from 'moment';
import style from './index.less';
import { getOptionList } from '@/utils/utils';
const FormItem = Form.Item;

@Form.create()
class UpdateRule extends React.Component {
  handleOk = () => {
    const { form, handleUpdateRule, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.id = record.id;
      fieldsValue.ruleConfigId = record.ruleConfigId;
      fieldsValue.role = fieldsValue.role.toString();
      handleUpdateRule(fieldsValue);
    });
  };
  render() {
    const { title, updateVisible, handleUpdateVisible, roleList, record } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 16,
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
          <FormItem label="规则名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: record.name,
              rules: [
                {
                  required: true,
                  message: '规则名称不能为空',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="适用人员" {...formItemLayout}>
            {getFieldDecorator('role', {
              initialValue: parseInt(record.role),
              rules: [
                {
                  required: true,
                  message: '适用人员不能为空',
                },
              ],
            })(<Select placeholder="请选择">{getOptionList(roleList)}</Select>)}
          </FormItem>
          <FormItem label="平时加班倍率" {...formItemLayout}>
            {getFieldDecorator('normal', {
              initialValue: record.normal,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="周末加班倍率" {...formItemLayout}>
            {getFieldDecorator('weekend', {
              initialValue: record.weekend,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="节假日加班倍率" {...formItemLayout}>
            {getFieldDecorator('holiday', {
              initialValue: record.holiday,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@connect(({ rulesConfig, loading }) => ({
  rulesConfig,
  loading: loading.models.rulesConfig,
}))
export default class RulesConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      updateVisible: false,
      record: {},
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesConfig/fetchRuleList',
    });

    dispatch({
      type: 'rulesConfig/fetchRoleList',
    });
  }
  handleRowKey = record => {
    return record.id;
  };
  handleUpdateVisible = (flag, record) => {
    if (record) {
      this.setState({
        updateVisible: !!flag,
        title: '编辑规则',
        record,
      });
    } else {
      this.setState({
        updateVisible: !!flag,
      });
    }
  };
  handleUpdateRule = fields => {
    
    const params = {
      id: fields.id,
      ruleConfigId: parseInt(fields.ruleConfigId),
      name: fields.name,
      baseConfig: {
        role: fields.role,
        normal: fields.normal,
        weekend: fields.weekend,
        holiday: fields.holiday,
      },
    };
    console.log(params);
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesConfig/updateRule',
      payload: params,
    }).then(() => {
      const {
        rulesConfig: { status },
        dispatch,
      } = this.props;
      if (status === 200) {
        message.success('更新成功！');
        this.handleUpdateVisible(false);
        dispatch({
          type: 'rulesConfig/fetchRuleList',
        });
      }
    });
  };
  render() {
    const columns = [
      {
        title: '规则名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '适用人员',
        dataIndex: 'role',
        align: 'center',
      },
      {
        title: '平时加班倍率',
        dataIndex: 'normal',
        align: 'center',
      },
      {
        title: '周末加班倍率',
        dataIndex: 'weekend',
        align: 'center',
      },
      {
        title: '节假日加班倍率',
        dataIndex: 'holiday',
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
      rulesConfig: { list, roleList },
      loading,
    } = this.props;
    console.log(list);

    const updateRuleProps = {
      title: this.state.title,
      updateVisible: this.state.updateVisible,
      roleList: roleList,
      record: this.state.record,
      handleUpdateVisible: this.handleUpdateVisible,
      handleUpdateRule: this.handleUpdateRule,
    };
    return (
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
        <Card title="加班工时计算规则">
          <Table
            columns={columns}
            dataSource={list}
            loading={loading}
            rowKey={this.handleRowKey}
            className={style.departmentList}
          />
        </Card>
        <UpdateRule {...updateRuleProps} />
      </div>
    );
  }
}
