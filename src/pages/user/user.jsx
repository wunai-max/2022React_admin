import React, { useEffect } from 'react'

import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd';
import { useSetState } from '../../components/hooks';
import { formateDate } from "../../utils/dateUtils"
import { reqAddUser, reqDeleteUser, reqUpdateUser, reqUserList } from '../../api';
import UserForm from './user-form';
import LinkButton from '../../components/link-button'


export default function User() {

  let formRef = null;

  const [state, setState] = useSetState({
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
    roleNames: {},
    user: {},
  })

  useEffect(() => {
    getUserList();
  }, [])

  const getUserList = async () => {
    const res = await reqUserList();
    if (res.status === 0) {
      const { users, roles } = res.data
      initRoleNames(roles);
      setState({
        users, roles
      })
    }
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },

    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: formateDate
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: (role_id) => state.roleNames[role_id]
    },
    {
      title: '操作',
      render: (user) => (
        <span>
          <LinkButton onClick={() => showUpdate(user)}>修改</LinkButton>
          <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
        </span>
      )
    },
  ]

  const showAdd = () => {
    setState({
      isShow: true,
      user:{}
    })
  }

  const showUpdate = (user) => {
    setState({
      isShow: true,
      user: user
    })
  }

  const deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功!')
          getUserList()
        }
      }
    })
  }

  const addOrUpdateUser = async () => {
    formRef?.current?.submit?.()
    let params = formRef?.current?.getFieldsValue?.('userData')
    let res;
    if (state.user._id) {
      params._id=state.user._id;
      console.log('>>>>>>@@@修改', params);
      res = await reqUpdateUser(params)
    } else {
      console.log('>>>>>>@@@添加', params);
      res = await reqAddUser(params)
    }
    if (res.status === 0) {
      message.success(state.user._id?'用户更新成功':'用户添加成功')
      setState({
        isShow: false,
      })
      getUserList()
    } else {
      message.error(state.user._id?'用户失败':'用户添加失败')
    }
  }

  /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
   */
  const initRoleNames = (roles) => {
    let roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    setState({
      roleNames
    })
  }


  const title = <Button type='primary' onClick={showAdd}>创建用户</Button>
  return (
    <Card title={title}>
      <Table
        bordered
        rowKey='_id'
        dataSource={state.users}
        columns={columns}
        pagination={{ defaultPageSize: 5 }}
      />

      <Modal
        title={state.user._id ? '修改用户' : '添加用户'}
        visible={state.isShow}
        onOk={addOrUpdateUser}
        onCancel={() => {
          // this.form.resetFields()
          setState({ isShow: false })
        }}
        okText={'确认'}
        cancelText={'取消'}
      >
        <UserForm
          setForm={form => formRef = form}
          roles={state.roles}
          user={state.user}
        />
      </Modal>
    </Card>
  )
}
