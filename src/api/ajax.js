/* 
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1.优化:统一处理请求异常
    在外层包一个自己创建的promise
2.优化2:异步得到不是 reponse,而是 response.data 在请求成功 esolve,时: resolve( response.data)   
*/

import axios from "axios";
import { message } from "antd";

function ajax(url, data = {}, type = 'GET') {
    //自己创建promise用来处理统一错误
    return new Promise(function (resolve, reject) {
        let promise
        // 执行异步 ajax 请求 
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            }) // params 配置指定的是 query 参数
        } else {
            promise = axios.post(url, data)
        }
        promise.then(response => {
            // 如果成功了, 调用 resolve(response.data) 
            resolve(response.data)

        }).catch(error => {
            // 对所有 ajax 请求出错做统一处理, 外层就不用再处理错误了 
            // 如果失败了, 提示请求后台出错 
            message.error('请求错误: ' + error.message)
        })
    })

}

export default ajax