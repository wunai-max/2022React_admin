import React, { useEffect } from 'react'

import {
    Form,
    Input,
    Select,
} from 'antd';

const Item = Form.Item
const Option = Select.Option

export default function AddFrom(props) {

    const { classifyList, parentId } = props

    const formRef = React.createRef()

    useEffect(() => {
        props?.setForm(formRef);
        formRef?.current?.resetFields() //清除from缓存数据   
    })

    const formItemLayout = {
        labelCol: { span: 4},  // 左侧label的宽度
        wrapperCol: { span: 16 }, // 右侧包裹的宽度
      }

    const onFinish = (values) => {
        formRef.current.setFieldsValue({
            RoleName: values.RoleName
        })
    }

    return (
        <Form onFinish={onFinish} ref={formRef} {...formItemLayout}>
            <Item name="RoleName" label='角色名称' rules={[
                { required: true, whitespace: true, message: '角色名称必须输入' },]}>
                <Input placeholder='请输入角色名'></Input>
            </Item>
        </Form>
    )
}
