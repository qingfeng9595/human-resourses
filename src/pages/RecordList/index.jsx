import { Button, Divider, Dropdown, Form, Icon, Menu, message, Table,Badge } from 'antd';
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

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addRule({
      desc: fields.desc,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
@connect(({ recordList, loading }) => ({
  recordList,
  loading: loading.models.recordList,
}))
class RecordList extends React.Component {
  constructor(props){
    super(props)
    this.state={
      pageSize:10,
      current:1,
    }
  }
  // const [createModalVisible, handleModalVisible] = useState(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  // const [actionRef, setActionRef] = useState();
  handleGetRecordList=(param)=>{

  }
  onShowSizeChange=(current, pageSize) =>{
    console.log(current, pageSize);
    this.setState({
      pageSize,
      current
    })
  }
  handleRowKey=(record)=>{
    return record.employeeId
  }
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'recordList/fetchRecordList',
      payload:{
        page:this.state.current,
        size:this.state.pageSize,
        data:{}
      }
    });
  }
  render(){
    const columns = [
      {
        title: '部门',
        dataIndex: 'dept_id',
        align:'center'
      },
      {
        title: '人员',
        dataIndex: 'employeeName',
        align:'center'
      },
      {
        title: '岗位',
        dataIndex: 'position',
        align:'center'
      },
      {
        title: '日期',
        dataIndex: 'startTime',
        align:'center',
        render:val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '上班时间',
        dataIndex: 'startTime',
        align:'center',
        render:val => <span>{moment(val).format('HH:mm')}</span>,
      },
      {
        title: '下班时间',
        dataIndex: 'endTime',
        align:'center',
        render:val => <span>{moment(val).format('HH:mm')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        align:'center',
        render:(text)=>{
          switch (text) {
            case "0":
              return<Badge status="success" text="正常"/>
              break;
            case "1":
              return <Badge status="warning" text="加班" />
              break;
            case "2":
              return<Badge status="error" text="异常" />
              break;
            case "3":
              return<Badge status="Error" text="迟到" />
              break;
            case "4":
              return<Badge status="Error" text="早退" />
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
        align:'center',
        render: (_, record) => (
          <>
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >
              配置
            </a>
            <Divider type="vertical" />
            <a href="">订阅警报</a>
          </>
        ),
      },
    ];
    const formList = [
      {
        key:'b',
        type:'Range',
        label:'日期',
        field:'date',
      },
      {
        key:'c',
        type:'Input',
        label:'人员',
        field:'user',
        placeholder:'请输入',
      },
      {
        key:'a',
        type:'Select',
        label:'部门',
        field:'department',
        placeholder:'请选择',
        list: [{ key: '0', itemName: '全部' }, { key: '1', itemName: '部门1' }, { key: '2', itemName: '部门2' }, { key: '3', itemName: '部门3' }]
      },
      {
        key:'d',
        type:'Input',
        label:'岗位',
        field:'position',
        placeholder:'请输入',
      },
      {
        key:'e',
        type:'Select',
        label:'状态',
        field:'status',
        placeholder:'请选择',
        list: [{ key: '0', itemName: '全部' }, { key: '1', itemName: '正常' }, { key: '2', itemName: '迟到' }, { key: '3', itemName: '早退' },{ key: '4', itemName: '异常' }]
      },
    ]
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize:this.state.pageSize,
      current:this.state.current,
      onShowSizeChange:this.onShowSizeChange
    };
    const {
      recordList: { list },
      loading,
    } = this.props;
    console.log();
    
    return (
      <div className={style.recordLayout}>
        <div className={style.searchForm}>
          <SearchForm  formList={formList} styles={style}/>
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
      // <PageHeaderWrapper>
      //   <ProTable
      //     headerTitle="查询表格"
      //     onInit={setActionRef}
      //     rowKey="key"
      //     toolBarRender={(action, { selectedRows }) => [
      //       <Button icon="plus" type="primary" onClick={() => handleModalVisible(true)}>
      //         新建
      //       </Button>,
      //       selectedRows && selectedRows.length > 0 && (
      //         <Dropdown
      //           overlay={
      //             <Menu
      //               onClick={async e => {
      //                 if (e.key === 'remove') {
      //                   await handleRemove(selectedRows);
      //                   action.reload();
      //                 }
      //               }}
      //               selectedKeys={[]}
      //             >
      //               <Menu.Item key="remove">批量删除</Menu.Item>
      //               <Menu.Item key="approval">批量审批</Menu.Item>
      //             </Menu>
      //           }
      //         >
      //           <Button>
      //             批量操作 <Icon type="down" />
      //           </Button>
      //         </Dropdown>
      //       ),
      //     ]}
      //     tableAlertRender={(selectedRowKeys, selectedRows) => (
      //       <div>
      //         已选择{' '}
      //         <a
      //           style={{
      //             fontWeight: 600,
      //           }}
      //         >
      //           {selectedRowKeys.length}
      //         </a>{' '}
      //         项&nbsp;&nbsp;
      //         <span>
      //           服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万
      //         </span>
      //       </div>
      //     )}
      //     request={params => queryRule(params)}
      //     columns={columns}
      //   />
      //   <CreateForm
      //     onSubmit={async value => {
      //       const success = await handleAdd(value);
  
      //       if (success) {
      //         handleModalVisible(false);
      //         actionRef.reload();
      //       }
      //     }}
      //     onCancel={() => handleModalVisible(false)}
      //     modalVisible={createModalVisible}
      //   />
      //   {stepFormValues && Object.keys(stepFormValues).length ? (
      //     <UpdateForm
      //       onSubmit={async value => {
      //         const success = await handleUpdate(value);
  
      //         if (success) {
      //           handleModalVisible(false);
      //           setStepFormValues({});
      //           actionRef.reload();
      //         }
      //       }}
      //       onCancel={() => {
      //         handleUpdateModalVisible(false);
      //         setStepFormValues({});
      //       }}
      //       updateModalVisible={updateModalVisible}
      //       values={stepFormValues}
      //     />
      //   ) : null}
      // </PageHeaderWrapper>
    );
  }
};

// export default Form.create()(RecordList);
export default RecordList;
