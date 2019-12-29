import { Form, Input, Modal, DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';
const { TextArea } = Input;
const FormItem = Form.Item;

class OvertimeApply extends React.Component {
  constructor(props){
    super(props)
    this.state={}
  }
  render(){
    const { modalVisible, handleAdd, onCancel,form, record,deptList } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        fieldsValue.startTime = moment(record.startTime).format("YYYY-MM-DD HH:mm:ss")
        fieldsValue.endTime = moment(record.endTime).format("YYYY-MM-DD HH:mm:ss")
        fieldsValue.deptId = record.deptId
        fieldsValue.attendanceId = record.id
        delete fieldsValue.date
        handleAdd(fieldsValue);
      });
    };
    const deptLeader=(deptId)=>{
      let name
      deptList.map(item=>{
        if(item.id === deptId){
          name = item.employeeName
        }
      })    
      return name
    }
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
        destroyOnClose
        title="加班申请"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => onCancel()}
      >
        <Form layout="horizontal">
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: record.employeeName,
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="申请日期" {...formItemLayout}>
            {getFieldDecorator('date', {
              initialValue: moment(record.joinDate),
            })(<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabled />)}
          </FormItem>
          <FormItem label="上班时间" {...formItemLayout}>
            {getFieldDecorator('startTime', {
              initialValue: moment(record.startTime).format('HH:mm'),
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="下班时间" {...formItemLayout}>
            {getFieldDecorator('endTime', {
              initialValue: moment(record.endTime).format('HH:mm'),
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="加班时长" {...formItemLayout}>
            {getFieldDecorator('overtime', {
              initialValue: record.overtime,
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="审批人" {...formItemLayout}>
            {getFieldDecorator('deptId', {
              initialValue: deptLeader(record.deptId),
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="加班原因" {...formItemLayout}>
            {getFieldDecorator('overtimeReason', {
              initialValue: record.overtimeReason,
            })(<TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
};

export default Form.create()(OvertimeApply);
