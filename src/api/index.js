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
