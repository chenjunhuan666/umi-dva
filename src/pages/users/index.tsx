import React,{ useState, FC } from 'react'
import styles from './index.less';
import { Popconfirm, Button, Pagination, message  } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table'; 
import { addRecord, editRecord } from './service'
import { connect, Dispatch, Loading, UserState } from 'umi'
import UserModal from './components/UserModal'
import { SingleUserType, FormValue } from './data.d'

interface UserPageProps {
  users: UserState,
  dispatch: Dispatch,
  handleCancle: ()=>void,
  onFinish: (values: FormValue) => void,
  userListLoading: boolean,
  confirmLoading: boolean,
}


const UserListPage:FC<UserPageProps> = ({ users, dispatch, userListLoading } ) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmloading] = useState(false)

  const [record, setRecord] = useState<SingleUserType | null>(null)
  
  // 关闭modal
  const handleCancle = () => {
    setModalVisible(false)
  }

  const listDelete = (record: SingleUserType) => {
    setRecord(record)
  }

  // 刷新
  const resetHandler = () => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page
      }
    })
  }

  // 删除
  const confirmDelete = () => {
    const id = record && record.id
    dispatch({
      type: 'users/delete',
      payload: {
        id
      }
    })    
  }

  // 增加
  const addClick = () =>{
    setRecord(null)
    setModalVisible(true)
  }

  // 点击编辑按钮
  const editClick = (record: SingleUserType) => {
    setModalVisible(true)
    setRecord(record)
  }

  // 确认修改
  const onFinish = async(values: FormValue) => {
    setConfirmloading(true)
    let id = 0;
    if(record){
      id = record.id
    }

    let serviceFunc;
    if(id){
      serviceFunc = editRecord
    }else{
      serviceFunc = addRecord
    }
    const result = await serviceFunc({id, values})

    if(result){ 
      setModalVisible(false)
      setConfirmloading(false)
      message.success(`${id === 0 ? 'ADD' : 'Edit'} Success`)
      resetHandler()
    }else{
      message.error(`${id === 0 ? 'Add' : 'Edit'} Failed`)
      setConfirmloading(false)
    }

  };

  // 页码跳转
  const paginationChange = (page: number, pageSize?: number) => {
    dispatch({
      type: 'users/getRemote',
      payload:{
        page,
        per_page: pageSize ? pageSize : users.meta.per_page
      }
    })
  }

  const columns: ProColumns<SingleUserType>[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'digit'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        valueType: 'text'
      },
      {
        title: 'Create Time',
        dataIndex: 'create_time',
        valueType: 'dateTime'
      },
      {
        title: 'Action',
        valueType: 'option',
        render: (text: any, record: SingleUserType) => [
            <a key={record.id} onClick={()=>editClick(record)}>Edit</a>,
            <Popconfirm
              key = {record.create_time}
              title="Are you sure delete this task?"
              onConfirm={confirmDelete}
              okText="Yes"
              cancelText="No"
            >
              <a  onClick={()=>listDelete(record)}>Delete</a>
            </Popconfirm>
        ]
      },
  ];

  return(
      <div className={styles.listTable}>

          <ProTable 
            rowKey='id' 
            headerTitle="User List"
            toolBarRender={() => [
              <Button onClick={addClick}type='primary'>ADD</Button>,
              <Button onClick={resetHandler}>Reload</Button>
            ]}
            columns={columns} 
            dataSource={users.data} 
            loading={userListLoading}
            search={false}
            pagination={false}
            options={{
              density: true,
              fullScreen: true,
              reload: () => {
                resetHandler()
              },
              setting: true
            }}
          />

          <Pagination
            className= 'list-page'
            total={users.meta.total}
            current={users.meta.page}
            pageSize = {users.meta.per_page}
            pageSizeOptions={['5', '10', '15', '20']}
            showSizeChanger
            showQuickJumper
            showTotal={total => `Total ${total} items`}
            onChange = { paginationChange }
          />

          <UserModal 
            visible={modalVisible} 
            handleCancle={handleCancle} 
            record={record}
            onFinish={onFinish}
            confirmLoading={confirmLoading}
          />  

      </div>
  )
}

const mapStateToProps = ({ users, loading }: {users: UserState, loading: Loading}) => {
  return {
    users,
    userListLoadin: loading.models.users
  }
}
export default connect(mapStateToProps)(UserListPage)