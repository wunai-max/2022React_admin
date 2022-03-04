/*
能根据接口文档定义接口请求
包含应用中所有接口请求的模块
每个函数的返回值都是promise
*/

import jsonp from 'jsonp'
import ajax from './ajax'

// const BASE ='http://localhost:8888' 
const BASE = '' //根据自己当前的地址去请求 package.json设置代理地址  proxy  处理跨域问题

//登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {
    username,
    password
}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

/*通过 jsonp 请求获取天气信息  解决GET类型跨域 */
// export function reqWeather(city) {
//     const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=d679a3a2b367acc60ed882ba0eb9603d&city=${city}`
//     return new Promise((resolve, reject) => {
//         jsonp(url, {
//             param: 'callback'
//         }, (error, response) => {
//             if (!error && response.status == '1') {
//                 const {province,weather,city} = response.lives[0]
//                 resolve({province,weather,city})
//             } else {
//                 alert('获取天气信息失败')
//             }
//         })
//     })
// }

// key=d679a3a2b367acc60ed882ba0eb9603d&city=${city}
export const reqWeather = (city) => ajax('https://restapi.amap.com/v3/weather/weatherInfo', city, 'GET')


//获取一级、二级分类列表

export const reqClassifyList = (parentId) => ajax(BASE + '/manage/category/list', {
    parentId
}) //形参默认值，不用些GET

//添加分类列表

export const reqAddClassify = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {
    categoryName,
    parentId
}, 'POST')

//更新分类名称

export const reqUpDateClassify = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')


//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {
    pageNum,
    pageSize
}, )

//搜索商品分页列表  seachType 搜索类型 productName/productDesc 两种值
export const reqSearchProducts = ({
        pageNum,
        pageSize,
        searchName,
        searchType
    }) =>
    ajax(BASE + '/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchName,
    }, )

//ID获取分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {
    categoryId
}) //形参默认值，不用些GET

//更新商品状态
export const reqUpdateStatus = ({
    productId,
    status
}) => ajax(BASE + '/manage/product/updateStatus', {
    productId,
    status,
}, 'POST')

//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {
    name
}, 'POST')

//添加商品和修改
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//修改商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')

//获取角色信息
export const reqRoleList = () => ajax(BASE + '/manage/role/list', {}) 
//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName},'POST') 

//更新角色
export const reqUpdateRole = (params) => ajax(BASE + '/manage/role/update', params,'POST') 

