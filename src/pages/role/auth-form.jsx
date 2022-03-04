import React, { useEffect, useImperativeHandle } from 'react'

import {
    Form,
    Input,
    Tree
} from 'antd';
import { useSetState } from '../../components/hooks';
import menuList from '../../config/menuConfig'

const Item = Form.Item

const AuthFrom = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({   //函数子组件暴露自身方法给父组件使用
        getmenus
    }))
    const [state, setState] = useSetState({
        role: {},
        checkedKeys: [],
        selectedKeys: [],
        autoExpandParent: true,
    })
    const getmenus = () => state.checkedKeys

    const treeData = menuList;

    useEffect(() => {
        // console.log('>>>>111', props?.role ?? {});
        setState({
            role: props?.role ?? {},
            checkedKeys: props?.role?.menus ?? [],
        })
    }, [props])

    const formItemLayout = {
        labelCol: { span: 4 },  // 左侧label的宽度
        wrapperCol: { span: 16 }, // 右侧包裹的宽度
    }

    const onCheck = (checkedKeysValue) => {
        // console.log('onCheck', checkedKeysValue);
        setState({
            checkedKeys: checkedKeysValue
        })
    };

    const onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        setState({
            selectedKeys: selectedKeysValue
        })
    };

    return (
        <div>
            <Item label='角色名称' {...formItemLayout}>
                <Input disabled value={state.role.name}></Input>
            </Item>
            <Tree
                checkable
                defaultExpandAll={true}
                autoExpandParent={state.autoExpandParent}
                onCheck={onCheck}
                checkedKeys={state.checkedKeys}
                onSelect={onSelect}
                selectedKeys={state.selectedKeys}
                treeData={treeData}
            />
        </div>
    )
})
export default AuthFrom;