import { Button, Divider, Dropdown, Form, Icon, Menu, message, Table, Badge } from 'antd';
import React, { useState, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SearchForm from '@/components/SearchForm'
import { connect } from 'dva';
import moment from 'moment';
import style from './index.less'
// import { queryRule, updateRule, addRule, removeRule } from './service';


@connect(({ recordList, loading }) => ({
  recordList,
  loading: loading.models.recordList,
}))
class RecordList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageSize: 10,
      page: 1,
      fields: {
        date: [
          new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`),
          new Date()
        ]
      }
    }
  }
  // const [createModalVisible, handleModalVisible] = useState(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  // const [actionRef, setActionRef] = useState();
  handleGetRecordList = (param) => {

  }
  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize,
    }, () => {
      this.SearchSubmit(this.state.fields)
    })
  }
  onShowPageChange = (current, pageSize) => {
    this.setState({
      page:current,
    }, () => {
      this.SearchSubmit(this.state.fields)
    })
  }
  handleRowKey = (record, i) => {
    return record.startTime + i
  }
  handleStatus = (val) => {
    switch (val) {
      case "正常":
        return "0"
        break;
      case "加班":
        return "1"
        break;
      case "异常":
        return "2"
        break;
      case "迟到":
        return "3"
        break;
      case "早退":
        return "4"
        break;
      default:
        return ''
        break;
    }
  }
  SearchSubmit = (fields) => {
    this.setState({
      fields
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'recordList/fetchRecordList',
      payload: {
        page: this.state.page,
        size: this.state.pageSize,
        data: {
          start_time: moment(fields.date[0]).format('YYYY-MM-DD'),
          end_time: moment(fields.date[1]).format('YYYY-MM-DD'),
          employeeName: fields.employeeName ? fields.employeeName : '',
          dept_id: fields.dept_id ? fields.dept_id : '',
          member: fields.member ? fields.member : '',
          status: this.handleStatus(fields.status)
        }
      }
    });
  }
  handleExport = () => {
    const { dispatch } = this.props
    const { fields } = this.state
    dispatch({
      type: 'recordList/fetchRecordExport',
      payload: {
        start_time: moment(fields.date[0]).format('YYYY-MM-DD'),
        end_time: moment(fields.date[1]).format('YYYY-MM-DD'),
        ...fields
      }
    })
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'recordList/fetchRecordList',
      payload: {
        page: this.state.page,
        size: this.state.pageSize,
        data: {
          start_time: moment(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`)).format('YYYY-MM-DD'),
          end_time: moment(new Date()).format('YYYY-MM-DD')
        }
      }
    });
  }
  render() {
    const columns = [
      {
        title: '部门',
        dataIndex: 'deptName',
        align: 'center'
      },
      {
        title: '员工',
        dataIndex: 'employeeName',
        align: 'center'
      },
      {
        title: '工号',
        dataIndex: 'jobMember',
        align: 'center'
      },
      {
        title: '日期',
        dataIndex: 'date',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '上班时间',
        dataIndex: 'startTime',
        align: 'center',
        render: val => <span>{moment(val).format('HH:mm')}</span>,
      },
      {
        title: '下班时间',
        dataIndex: 'endTime',
        align: 'center',
        render: val => <span>{moment(val).format('HH:mm')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: (text) => {
          switch (text) {
            case "0":
              return <Badge status="success" text="正常" />
              break;
            case "1":
              return <Badge status="warning" text="加班" />
              break;
            case "2":
              return <Badge status="error" text="异常" />
              break;
            case "3":
              return <Badge status="Error" text="迟到" />
              break;
            case "4":
              return <Badge status="Error" text="早退" />
              break;
            default:
              break;
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        align: 'center',
        render: (_, record) => {
          if (record.overtime > 0) {
            return <a>申请加班</a>
          } else if (record.status === '2') {
            return <a>申请补卡</a>
          } else if (record.status === '3' || record.status === '4') {
            return <a>申请调休</a>
          }
          // <>
          //   <a
          //     onClick={() => {
          //       handleUpdateModalVisible(true);
          //       setStepFormValues(record);
          //     }}
          //   >
          //     配置
          //   </a>
          //   <Divider type="vertical" />
          //   <a href="">订阅警报</a>
          // </>
        },
      },
    ];

    const formList = [
      {
        key: 'b',
        type: 'Range',
        label: '日期',
        field: 'date',
        initialValue: {
          start: moment(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`)),
          end: moment(new Date())
        },
      },
      {
        key: 'c',
        type: 'Input',
        label: '员工姓名',
        field: 'employeeName',
        placeholder: '请输入',
      },
      {
        key: 'a',
        type: 'Select',
        label: '所属部门',
        field: 'dept_id',
        placeholder: '请选择',
        list: [{ key: '0', itemName: '全部' }, { key: '1', itemName: '部门1' }, { key: '2', itemName: '部门2' }, { key: '3', itemName: '部门3' }]
      },
      {
        key: 'd',
        type: 'Input',
        label: '员工工号',
        field: 'member',
        placeholder: '请输入',
      },
      {
        key: 'e',
        type: 'Select',
        label: '状态',
        field: 'status',
        initialValue: '全部',
        placeholder: '请选择',
        list: [{ key: '0', itemName: '全部' }, { key: '0', itemName: '正常' }, { key: '1', itemName: '加班' }, { key: '2', itemName: '异常' }, { key: '3', itemName: '迟到' }, { key: '4', itemName: '早退' }]
      },
    ]
    const {
      recordList: { list, total },
      loading,
    } = this.props;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.state.pageSize,
      current: this.state.page,
      total: total,
      showTotal: total => `Total ${total} 条`,
      onChange: this.onShowPageChange,
      onShowSizeChange: this.onShowSizeChange
    };
    return (
      <div className={style.recordLayout}>
        <div className={style.searchForm}>
          <SearchForm formList={formList} styles={style} SearchSubmit={this.SearchSubmit} />
        </div>
        <div className={style.export}>
          <Button type='primary' icon='export' style={{ marginLeft: 8 }} onClick={this.handleExport} >导出Excel</Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={this.handleRowKey}
          pagination={pagination}
          className={style.recordList}
        />
      </div>
    );
  }
};

// export default Form.create()(RecordList);
export default RecordList;
