import React, { useEffect, useState } from 'react'

import {
    Form,
    Input,
} from 'antd';

const Item = Form.Item

export default function UpdateFrom(props) {

    const { categoryName } = props

    const formRef = React.createRef()

    useEffect(() => {
        props?.setForm(formRef);
        formRef?.current?.resetFields() //清除from缓存数据   
    })

    const onFinish = (values) => {
        console.log('>>>>>>触发',values);
        formRef.current.setFieldsValue({
            categoryObj: values
        })
    }

    return (
        <Form onFinish={onFinish} ref={formRef}>
            <Item name="categoryName" initialValue={categoryName} rules={[
                { required: true, whitespace: true, message: '分类名称必须输入' },
            ]}>
                <Input placeholder={'请输入分类名称'}></Input>
            </Item>
        </Form>
    )
}
