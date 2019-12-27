import { Button, Divider, Modal, Form, Input, Select, message, Table, Card, TimePicker } from 'antd';
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

@Form.create()
class CreateRule extends React.Component {
  handleOk = () => {
    const { form, handleCreateRule, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.ruleConfigId = '3';
      fieldsValue.role = fieldsValue.role.toString();
      handleCreateRule(fieldsValue);
    });
  };
  render() {
    const { title, createVisible, handleCreateVisible, roleList, record } = this.props;

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
        visible={createVisible}
        onOk={this.handleOk}
        onCancel={() => handleCreateVisible()}
      >
        <Form layout="horizontal">
          <FormItem label="规则名称" {...formItemLayout}>
            {getFieldDecorator('name', {
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
              initialValue:'1',
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="周末加班倍率" {...formItemLayout}>
            {getFieldDecorator('weekend', {
              initialValue: '2',
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="节假日加班倍率" {...formItemLayout}>
            {getFieldDecorator('holiday', {
              initialValue: '3',
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@Form.create()
class UpdateWorkRule extends React.Component {
  handleOk = () => {
    const { form, handleUpdateRule, record } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.id = record.id;
      fieldsValue.ruleConfigId = record.ruleConfigId;
      fieldsValue.start = moment(fieldsValue.start).format('HH:mm')
      fieldsValue.end = moment(fieldsValue.end).format('HH:mm')
      handleUpdateRule(fieldsValue);
    });
  };
  render() {
    const { title, workUpdateVisible, handleWorkUpdateVisible, roleList, record } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const { getFieldDecorator } = this.props.form;
    console.log(record);
    console.log(moment(record.start));
    
    return (
      <Modal
        title={title}
        destroyOnClose
        visible={workUpdateVisible}
        onOk={this.handleOk}
        onCancel={() => handleWorkUpdateVisible()}
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
          <FormItem label="上班打卡时间" {...formItemLayout}>
            {getFieldDecorator('start', {
              initialValue: moment(`2019-12-01 ${record.start}`),
            })(<TimePicker format="HH:mm"  style={{width:'100%'}}/>)}
          </FormItem>
          <FormItem label="下班打卡时间" {...formItemLayout}>
            {getFieldDecorator('end', {
              initialValue: moment(`2019-12-01 ${record.end}`),
            })(<TimePicker format="HH:mm" style={{ width: '100%' }}/>)}
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
      createVisible: false,
      workUpdateVisible:false,
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
  handleWorkUpdateVisible = (flag, record) => {
    if (record) {
      this.setState({
        workUpdateVisible: !!flag,
        title: '编辑规则',
        record,
      });
    } else {
      this.setState({
        workUpdateVisible: !!flag,
      });
    }
  };
  handleUpdateRule = fields => {
    const params = {
      id: fields.id ? fields.id:'',
      ruleConfigId: parseInt(fields.ruleConfigId),
      name: fields.name,
      baseConfig: {
        ...fields
      },
    };
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
        this.handleWorkUpdateVisible(false);
        dispatch({
          type: 'rulesConfig/fetchRuleList',
        });
      } else {
        message.error('更新失败！')
      }
    });
  };
  handleDeleteRule = record => {
    Modal.confirm({
      title: '删除规则',
      content: `是否确定删除${record.name}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleComfirmDetele(record)
    });

  }
  handleComfirmDetele = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesConfig/deleteRule',
      payload: record,
    }).then(() => {
      const {
        rulesConfig: { status },
        dispatch,
      } = this.props;
      if (status === 200) {
        message.success('删除成功！');
        dispatch({
          type: 'rulesConfig/fetchRuleList',
        });
      } else {
        message.error('删除失败！')
      }
    })
  }
  handleCreateVisible = (flag) => {
    this.setState({
      createVisible: !!flag,
      title: '新建规则',
    });
  };
  handleCreateRule = fields => {
    const params = {
      ruleConfigId: parseInt(fields.ruleConfigId),
      name: fields.name,
      baseConfig: {
        role: fields.role,
        normal: fields.normal,
        weekend: fields.weekend,
        holiday: fields.holiday,
      },
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesConfig/createRule',
      payload: params,
    }).then(() => {
      const {
        rulesConfig: { status },
        dispatch,
      } = this.props;
      if (status === 200) {
        message.success('创建成功！');
        this.handleCreateVisible(false);
        dispatch({
          type: 'rulesConfig/fetchRuleList',
        });
      } else {
        message.error('创建失败！')
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
        render: (text) => (
          <span>
            {roleList.map(item => {
              if (text == item.id) return item.roleName
            })}
          </span>
        ),
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
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.handleDeleteRule(record);
              }}
            > 删除</a>
          </span>
        ),
      },
    ];
    const workTimeColumns = [
      {
        title: '规则名称',
        dataIndex: 'name',
        align: 'center',
      },
      // {
      //   title: '适用人员',
      //   dataIndex: 'role',
      //   align: 'center',
      //   render: (text) => (
      //     <span>
      //       {roleList.map(item => {
      //         if (text == item.id) return item.roleName
      //       })}
      //     </span>
      //   ),
      // },
      {
        title: '上班打卡时间',
        dataIndex: 'start',
        align: 'center',
      },
      {
        title: '下班打卡时间',
        dataIndex: 'end',
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
                this.handleWorkUpdateVisible(true, record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.handleDeleteRule(record);
              }}
            > 删除</a>
          </span>
        ),
      },
    ]
    const {
      rulesConfig: { list, roleList, workTimeList },
      loading,
    } = this.props;
    const updateRuleProps = {
      title: this.state.title,
      updateVisible: this.state.updateVisible,
      workUpdateVisible: this.state.workUpdateVisible,
      roleList: roleList,
      record: this.state.record,
      handleUpdateVisible: this.handleUpdateVisible,
      handleWorkUpdateVisible: this.handleWorkUpdateVisible,
      handleUpdateRule: this.handleUpdateRule,
    };
    const createRuleProps = {
      title: this.state.title,
      createVisible: this.state.createVisible,
      roleList: roleList,
      record: this.state.record,
      handleCreateVisible: this.handleCreateVisible,
      handleCreateRule: this.handleCreateRule,
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
        <Card title="加班工时计算规则" extra={<Button type='primary' onClick={() => this.handleCreateVisible(true)}>新建</Button>}>
          <Table
            columns={columns}
            dataSource={list}
            loading={loading}
            rowKey={this.handleRowKey}
            className={style.overTimeList}
          />
        </Card>
        <Card title="员工打卡时间规则" className={style.normalTimeCard} >
          <Table
            columns={workTimeColumns}
            dataSource={workTimeList}
            loading={loading}
            rowKey={this.handleRowKey}
            className={style.normalTimeList}
          />
        </Card>
        <UpdateRule {...updateRuleProps} />
        <CreateRule {...createRuleProps} />
        <UpdateWorkRule {...updateRuleProps} />
      </div>
    );
  }
}
