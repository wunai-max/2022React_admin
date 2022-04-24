/*
redux最核心的管理对象store
 */
import {
    applyMiddleware,
    createStore
} from "redux"
import thunk from "redux-thunk" //异步使用redux
import {
    composeWithDevTools
} from 'redux-devtools-extension'  //工具栏显示


import reducer from './reducer'

//向外暴露一个store

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))