/*
能根据接口文档定义接口请求
包含应用中所有接口请求的模块
每个函数的返回值都是promise
*/

import ajax from './ajax'

// const BASE ='http://localhost:8888' 
const BASE = ''  //根据自己当前的地址去请求 package.json设置代理地址  proxy  处理跨域问题

//登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {
    username,
    password
}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')