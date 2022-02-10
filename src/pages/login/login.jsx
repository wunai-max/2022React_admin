import React, { useEffect } from 'react'
import './login.less'
import login from './images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api';
import { useNavigate } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

function Login() {

    //react-router-dom v5用useHistory()进行路由跳转 
    // const history = useHistory()
    //跳转路由（不需要回退用replace,需要回退用push）
    //history.repalace('/')

    //利用 v6版本用useNavigate()进行路由跳转 
    const navigate = useNavigate()

    useEffect(() => {
        const user = memoryUtils.user
        if (user && user._id) {
            //重定向admin页面
            return navigate('/')
        }
        // 解绑   componentWillUnmount
        return () => { console.log('你离开了登录页面') }
    }, [])

    const onFinish = async (values) => {

        //只有验证通过才会触发提交方法
        console.log('用户输入的值', values);
        const { username, password } = values

        //正常利用promise写法
        // reqLogin(username, password).then(response => {
        //     console.log('成功了',response.data);
        // }).catch(error => {
        //     console.log('失败了', error);
        // })

        //利用async await简化写法
        /*
        1.作用
          简化promise对象的使用：不再使用then()来指定成功/失败的回调函数
          以同步编码（没有回调函数）的方式实现异步流程
        2.哪里写await?
          在返回promise的表达式左侧写await：不想要 promise，想要promise异步执行的成功的value数据
        3.哪里写async
           await所在函数（最近的）定义在左侧     
          */
        const result = await reqLogin(username, password)
        console.log('请求成功', result);
        if (result.status === 0) {
            message.success('登录成功')
            //保存 user
            const user = result.data
            memoryUtils.user = user //存到内存中
            storageUtils.saveUser(user) //存到缓存 localStorage

            navigate("/", { replace: true });
        } else {
            message.error(result.msg)
        }
    }

    const onValuesChange = (values) => { };

    const validate = async (rule, value) => {
        if (!value) {
            throw new Error('密码不能为空');
        } else if (value.length < 4) {
            throw new Error('密码至多4位');
        } else if (value.length > 12) {
            throw new Error('密码至多12位');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            throw new Error('密码必须需是英文，数字或下划线组成');
        }
    }


    return (
        <div className='login'>
            <header className='login-header'>
                <img src={login} alt="login" />
                <h1>React项目:后台管理系统</h1>
            </header>
            <section className='login-content'>
                <h2>用户登录</h2>
                <div className='login-form'>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onValuesChange={onValuesChange}
                    >
                        <Form.Item
                            name="username"
                            //声明式验证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                { required: true, whitespace: true, message: '必须输入用户名' },
                                { min: 4, message: '用户名必须大于 4 位' },
                                { max: 12, message: '用户名必须小于 12 位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线 组成' }
                            ]}
                            initialValue='admin'
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{ color: '#eee' }} />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            //自定义验证
                            rules={[
                                { validator: validate }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" style={{ color: '#eee' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </div>
    )
}

export default Login; 