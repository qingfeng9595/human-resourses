import React, { PureComponent } from 'react';
import { Input, Select, Form, Button, DatePicker, Row, Col, Icon } from 'antd';
import { getOptionList } from '@/utils/utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import style from './index.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
  }
  handleSearchSubmit = e => {
    e.preventDefault();
    let fieldsValue = this.props.form.getFieldsValue();
    // 遍历表单对象，将时间类型、布尔类型进行装换
    // Object.entries(fieldsValue).map(item => {
    //   if (Array.isArray(item[1])) {
    //     var title = item[0];
    //     var start = title + '_begin';
    //     var end = title + '_end';
    //     fieldsValue[start] = moment(item[1][0]).format('YYYY-MM-DD');
    //     fieldsValue[end] = moment(item[1][1]).format('YYYY-MM-DD');
    //     delete fieldsValue[item[0]];
    //   }
    //   if (item[1] == '是') {
    //     fieldsValue[item[0]] = true;
    //   }
    //   if (item[1] == '否') {
    //     fieldsValue[item[0]] = false;
    //   }
    // });
    this.props.SearchSubmit(fieldsValue);
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };
  /**
   * 简单查询
   */
  renderSimpleForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { formList } = this.props;
    const formItemList = [];
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        if (i == 0 || i == 1) {
          let label = item.label;
          let field = item.field;
          let initialValue = item.initialValue || '';
          let placeholder = item.placeholder || '';
          if (item.type == 'Range') {
            const Range = (
              <Col md={8} sm={24} key={field} className={style.antcol}>
                <FormItem label={label} {...formLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(field,{
                    initialValue:[initialValue.start,initialValue.end]
                  })(
                    <RangePicker
                      allowClear={false}
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                    />,
                  )}
                </FormItem>
              </Col>
            );
            formItemList.push(Range);
          } else if (item.type == 'Input') {
            const INPUT = (
              <Col md={8} sm={24} key={field} className={style.antcol}>
                <FormItem label={label} {...formLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(field)(<Input placeholder={placeholder} />)}
                </FormItem>
              </Col>
            );
            formItemList.push(INPUT);
          } else if (item.type == 'Select') {
            const SELECT = (
              <Col md={8} sm={24} key={field} className={style.antcol}>
                <FormItem label={label} {...formLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(field, {
                    initialValue:initialValue
                  })(
                    <Select placeholder={placeholder} style={{ width: '100%' }}>
                      {getOptionList(item.list)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            );
            formItemList.push(SELECT);
          }
        }
      });
      const Buttons = (
        <Col md={8} sm={24} key="buttons" className={style.antcol}>
          {/* <span className={style.submitButtons}> */}
          <FormItem>
            <Button type="primary" htmlType="submit" icon='search'>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </FormItem>
          {/* </span> */}
        </Col>
      );
      formItemList.push(Buttons);
    }
    return formItemList;
  };
  /**
   * 复杂查询
   */
  renderAdvancedForm = () => {
    const { getFieldDecorator } = this.props.form;
    const formList = this.props.formList;
    const formItemList = [];
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label;
        let field = item.field;
        let initialValue = item.initialValue || '';
        let placeholder = item.placeholder || '';
        if (item.type == 'Range') {
          const Range = (
            <Col md={8} sm={24} key={field} className={style.antcol}>
              <FormItem label={label} {...formLayout} style={{ width: '100%' }}>
                {getFieldDecorator(field,{
                   initialValue:[initialValue.start,initialValue.end]
                })(
                  <RangePicker allowClear={false} style={{ width: '100%' }} format="YYYY-MM-DD" />,
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(Range);
        } else if (item.type == 'Input') {
          const INPUT = (
            <Col md={8} sm={24} key={field} className={style.antcol}>
              <FormItem label={label} {...formLayout} style={{ width: '100%' }}>
                {getFieldDecorator(field)(<Input placeholder={placeholder} />)}
              </FormItem>
            </Col>
          );
          formItemList.push(INPUT);
        } else if (item.type == 'Select') {
          const SELECT = (
            <Col md={8} sm={24} key={field} className={style.antcol}>
              <FormItem label={label} {...formLayout} style={{ width: '100%' }}>
                {getFieldDecorator(field, {
                  initialValue:initialValue
                })(
                  <Select placeholder={placeholder} style={{ width: '100%' }}>
                    {getOptionList(item.list)}
                  </Select>,
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(SELECT);
        }
      });
      const Buttons = (
        <Col md={8} sm={24} key="buttons" className={style.antcol}>
          <FormItem>
            <Button type="primary" htmlType="submit" icon='search'>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </FormItem>
        </Col>
      );
      formItemList.push(Buttons);
    }
    return formItemList;
  };

  render() {
    return (
      <Form layout="inline" onSubmit={this.handleSearchSubmit}>
        <Row gutter={{ md: 4, lg: 12, xl: 24 }}>{this.renderForm()}</Row>
        {/* {this.state.expandForm ? (
          <div style={{ overflow: 'hidden' }} key="buttons">
            <div style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </div>
          </div>
        ) : null} */}
      </Form>
    );
  }
}
// Form.create({})(SearchForm);
export default SearchForm;
SearchForm.propTypes = {
  formList: PropTypes.array,
  SearchSubmit: PropTypes.func,
};
