import React from 'react'
import './login.less'
import login from './images/logo.png'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function Login() {

    const onFinish = (values) => {
        //只有验证通过才会触发提交方法
        console.log('Received values of form: ', values);
    }

    const onValuesChange = (values) => {

    };

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