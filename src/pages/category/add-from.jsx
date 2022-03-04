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

    const onFinish = (values) => {
        formRef.current.setFieldsValue({
            categoryObj: values
        })
    }

    return (
        <Form onFinish={onFinish} ref={formRef}>
            <Item name="categoryId" initialValue={parentId}>
                <Select>
                    <Option value={'0'} key={'0'}>一级分类</Option>
                    {(classifyList ?? []).map(item => (
                        <Option value={item._id} key={item._id}>{item.name}</Option>
                    ))
                    }
                </Select>
            </Item>
            <Item name="categoryName" rules={[
                { required: true, whitespace: true, message: '分类名称必须输入' },]}>
                <Input placeholder='请输入分类名称'></Input>
            </Item>
        </Form>
    )
}
