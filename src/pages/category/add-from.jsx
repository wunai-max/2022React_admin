import React from 'react'

import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
} from 'antd';

const Item = Form.Item
const Option = Select.Option

export default function AddFrom(props) {
    return (
        <Form onFinish={onFinish}>
            <Item>
                <Select>
                    <Option value='0'>一级分类</Option>
                    <Option value='0'>狄安娜</Option>
                    <Option value='0'>图书</Option>
                </Select>
            </Item>
            <Item>
                <Input placeholder='请输入分类名称'></Input>
            </Item>
        </Form>
    )
}
