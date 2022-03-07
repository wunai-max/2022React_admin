import React, { useEffect } from 'react'

import {
    Form,
    Input,
    Select,
} from 'antd';
import { useSetState } from '../../components/hooks';

const Item = Form.Item
const Option = Select.Option

export default function UserForm(props) {
  
   const formRef = React.createRef()

    useEffect(() => {
        props?.setForm(formRef);
        formRef?.current?.resetFields()//清除from缓存数据 
    }, [props])

    const formItemLayout = {
        labelCol: { span: 4 },  // 左侧label的宽度
        wrapperCol: { span: 16 }, // 右侧包裹的宽度
    }

    const onFinish = (values) => {
        formRef.current.setFieldsValue({
            userData: values
        })
    }

    return (
        <Form onFinish={onFinish} ref={formRef} {...formItemLayout}>
            <Item name="username" label='用户名' initialValue={props?.user?.username ?? ''} rules={[
                { required: true, whitespace: true, message: '角色名称必须输入' },]}>
                <Input placeholder='请输入用户名'></Input>
            </Item>
            {(props?.user?._id ?? '') === '' ? (
                <Item name="password" label='密码' rules={[
                    { required: true, whitespace: true, message: '角色名称必须输入' },]}>
                    <Input placeholder='请输入密码'></Input>
                </Item>
            ) : null
            }
            <Item name="email" label='邮箱' initialValue={props?.user?.email ?? ''}>
                <Input placeholder='请输入邮箱'></Input>
            </Item>
            <Item name="phone" label='手机号' initialValue={props?.user?.phone ?? ''}>
                <Input placeholder='请输入手机号'></Input>
            </Item>
            <Item name={'role_id'} label='角色' initialValue={props?.user?.role_id ?? ''} rules={[
                { required: true, message: '角色名称必须选中' }]}>
                <Select>
                    {
                        (props?.roles ?? [])?.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                    }
                </Select>
            </Item>
        </Form>
    )
}
