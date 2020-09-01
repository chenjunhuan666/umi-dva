import request, { extend } from 'umi-request';
import { message } from 'antd';
import {  FormValue } from './data.d'

const errorHandler = function(error: any) {
  if (error.response) {
    // 请求已发送但服务端返回状态码非 2xx 的响应
    if(error.response.status > 400){
      message.error(error.data.message ? error.data.message : error.data )
    }
    // console.log(error.response.status); // code
    // console.log(error.data);
  } else {
    // 请求初始化时出错或者没有响应返回的异常
    // console.log(error.message);
    message.error('Network Error')
  }

  throw error; // 如果throw. 错误将继续抛出.

  // 如果return, 则将值作为返回. 'return;' 相当于return undefined, 在处理结果时判断response是否有值即可.
  // return {some: 'data'};
};

// 1. 作为统一错误处理
const extendRequest = extend({ errorHandler });

// 获取表单
export const getRemoteList = async ( { page, per_page}: {page: number, per_page: number}) => {
    return extendRequest(`http://public-api-v1.aspirantzhang.com/users?page=${page}&per_page=${per_page}`, {
      method: 'get',
      params: { },
    }).then(res => {
      return res
    }).catch(err => 
      {return false}
    )
}

// 编辑表单
export const editRecord = async ({id, values}:{id: number, values: FormValue}) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'put',
    data: values,
  }).then(res => {
    return true
  }).catch(err => 
    {return false}
  )
}

// 删除表单
export const deleteList = async ({ id }: {id: number}) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'delete',
    // params: {
    //   id
    // },
  }).then(res => {
    return true
  }).catch(err => 
    {return false}
  )
}

// 添加表单
export const addRecord = async ({ values }: {values: FormValue}) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users`, {
    method: 'post',
    data: values,
  }).then(res => {
    return true
  }).catch(err => 
    {return false}
  )
}
