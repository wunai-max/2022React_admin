import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import 'antd/dist/antd.less';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import store from './redux/store';

//读取localStorage中保存的user存到内存中
const user = storageUtils.getUser()
if (user && user._id) {
    memoryUtils.user = user
}

ReactDOM.render( (
    <Provider store={store}>
      < App / >
    </Provider>

    ) , document.getElementById('root'));