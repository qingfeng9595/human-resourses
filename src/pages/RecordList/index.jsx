import { Button, Divider, Dropdown, Form, Icon, Menu, message, Table, Badge } from 'antd';
import React, { useState, Fragment } from 'react';
import OvertimeApply from './components/OvertimeApply';
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
      applyVisible:false,
      record:{},
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
      page: current,
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
          status:fields.status=='00'?"":fields.status,
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
  handleApplyVisible = (flag, record) => {
    if(!record){
      this.setState({
        applyVisible: !!flag
      });
      return
    }
    const { dispatch } = this.props
    dispatch({
      type: 'recordList/fetchOvertime',
      payload: record
    }).then(()=>{
      const {
        recordList:{overtime},
      } = this.props
      this.setState({
        record: overtime,
        applyVisible: !!flag
      });
    })
  }
  handleApply=fields=>{
    const { dispatch } = this.props
    dispatch({
      type:"recordList/overtimeApply",
      payload:fields
    }).then(()=>{
      const { 
        recordList: { status }
       } = this.props
       if (status === 200){
        message.success('创建成功！')
        this.handleApplyVisible()
        this.SearchSubmit(this.state.fields)
      }else{
        message.error('创建失败！')
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
    dispatch({
      type: 'recordList/fetchDepartmentList',
    })
  }
  render() {
    const {
      recordList: { list, total, deptList },
      loading,
    } = this.props;
    console.log(list);
    
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
        dataIndex: 'jobNumber',
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
        title: '加班时间',
        dataIndex: 'overtime',
        align: 'overtime',
        // render: val => <span>{moment(val).format('HH:mm')}</span>,
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
          if (record.status === '1' ) {
            if(record.op === 1){return <a>已申请</a>}
            return <a onClick={() => this.handleApplyVisible(true, record)}>申请加班</a>
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
        list: deptList
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
        initialValue: '00',
        placeholder: '请选择',
        list: [{ id: '00', deptName: '全部' }, { id: '0', deptName: '正常' }, { id: '1', deptName: '加班' }, { id: '2', deptName: '异常' }, { id: '3', deptName: '迟到' }, { id: '4', deptName: '早退' }]
      },
    ]
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
    const overtimeApplyProps = {
      modalVisible:this.state.applyVisible,
      handleAdd:this.handleApply,
      onCancel: this.handleApplyVisible,
      record: this.state.record,
      deptList:deptList
    }
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
        <OvertimeApply {...overtimeApplyProps}/>
      </div>
    );
  }
};

// export default Form.create()(RecordList);
export default RecordList;
