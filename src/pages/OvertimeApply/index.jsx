import { Button, Row, Col, Form, Icon, Menu, message,Input } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import style from './index.less'
const FormItem = Form.Item;

@Form.create()
export default class OvertimeApply extends React.Component{
  render(){
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    return(
      <div className={style.overtimeApply}>
        <Row>
        <Form>
         <Col span={12}  offset={4}>
            <FormItem label="姓名" {...formLayout} style={{ width: '100%' }}>
              {getFieldDecorator("employeeName",{
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col> 
          <Col span={12}  offset={4}>
            <FormItem label="工号" {...formLayout} style={{ width: '100%' }}>
              {getFieldDecorator("member",{
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col> 
        </Form>
        </Row>
      </div>
    )
  }
}
