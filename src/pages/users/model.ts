/* 
    仓库文件 / 数据模型
*/
import { Reducer, Effect, Subscription } from 'umi';
import { getRemoteList, editRecord, deleteList,addRecord } from './service'
import { message } from 'antd';
import { SingleUserType } from './data'

export interface UserState {
  data: SingleUserType[],
  meta: {
    total: number,
    per_page: number,
    page: number
  }
}

interface UserModelType {
  namespace: 'users',
  state: UserState,
  reducers: {
    getList: Reducer<UserState>
  },
  effects: {
    getRemote: Effect,
    delete: Effect,
  },
  subscriptions: {
    setup: Subscription
  }
}

const UserModel: UserModelType = {
    namespace: 'users',
    state: {
      data: [],
      meta: {
        total: 0,
        per_page: 5,
        page: 1
      }
    },
    reducers: {
      getList(state, action){
        return action.payload  
      }
    },
    effects: {
      // 获取列表数据
      *getRemote({ payload: { page, per_page }}, {put, call}){
        const data = yield call(getRemoteList, { page, per_page })
        if(data){
          yield put({
            type: 'getList',
            payload: data
          })
        }
        
      },
    
      // 删除
      *delete({payload:{id}}, { put, call, select }){

        const data = yield call(deleteList,{ id })
        // 同类调用 getRemote
        if(data){
          const {page, per_page} = yield select((state: any) => state.users.meta)
          yield put({
            type: 'getRemote',
            payload: {
              page,
              per_page
            }
          })
          message.success('Delete Success')
        }else{
          message.error('Delete Error')
        }
      },
    },
    
    subscriptions: {
      setup({ dispatch, history }, done){
        return history.listen(({pathname}) => {
          // console.log('subscriptions')
          if(pathname === '/users'){
            dispatch({
              type: 'getRemote',
              payload: {
                page: 1,
                per_page: 5
              }
            })
          }
        })
      }
    }

}

export default UserModel
