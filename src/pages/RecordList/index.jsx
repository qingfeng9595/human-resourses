import { Button, Divider, Dropdown, Form, Icon, Menu, message,Table } from 'antd';
import React, { useState, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
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

    }
  }
  // const [createModalVisible, handleModalVisible] = useState(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  // const [actionRef, setActionRef] = useState();
  handleGetRecordList=(param)=>{

  }
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'recordList/fetchRecordList',
      payload:{}
    });
  }
  render(){
    const columns = [
      {
        title: '规则名称',
        dataIndex: 'name',
        align:'center'
      },
      {
        title: '描述',
        dataIndex: 'desc',
        align:'center'
      },
      {
        title: '服务调用次数',
        dataIndex: 'callNo',
        sorter: true,
        renderText: val => `${val} 万`,
        align:'center'
      },
      {
        title: '状态',
        dataIndex: 'status',
        align:'center',
        valueEnum: {
          0: {
            text: '关闭',
            status: 'Default',
          },
          1: {
            text: '运行中',
            status: 'Processing',
          },
          2: {
            text: '已上线',
            status: 'Success',
          },
          3: {
            text: '异常',
            status: 'Error',
          },
        },
      },
      {
        title: '上次调度时间',
        dataIndex: 'updatedAt',
        sorter: true,
        valueType: 'dateTime',
        align:'center'
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
    const {
      recordList: { list },
      loading,
    } = this.props;
    return (
      <Fragment>
        <Table
        columns={columns}
        dataSource={list.data}
        loading={loading}
        className={style.recordList}
        />
      </Fragment>
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
