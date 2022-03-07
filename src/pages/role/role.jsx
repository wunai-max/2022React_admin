import React, { useEffect, useRef } from 'react'
import { Card, Button, Table, message, } from 'antd';
import { useSetState } from '../../components/hooks';
import { constants } from '../../utils/constants';
import { formateDate } from '../../utils/dateUtils.js'
import { reqAddRole, reqRoleList, reqUpdateRole } from '../../api';
import memoryUtils from "../../utils/memoryUtils"
import AddFrom from './add-form';
import Modal from 'antd/lib/modal/Modal';
import AuthFrom from './auth-form';
import { useNavigate } from 'react-router-dom';
import storageUtils from '../../utils/storageUtils';

export default function Role() {
  let formRef = null;
  const authRef = useRef(null);
  const navigate = useNavigate()
  const [state, setState] = useSetState({
    isShowAdd: false,
    isShowAuth: false,
    role: {},
    roles: []
  })

  useEffect(() => {
    getRoles();
  }, [])

  const getRoles = async () => {
    let res = await reqRoleList();
    if (res.status === 0) {
      setState({
        roles: res.data
      })
    }
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: (create_time) => formateDate(create_time)
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: formateDate
    },
    {
      title: '授权人',
      dataIndex: 'auth_name'
    },
  ]


  const title = (
    <span>
      <Button type='primary' onClick={() => setState({ isShowAdd: true })}>创建角色</Button> &nbsp;&nbsp;
      <Button type='primary' disabled={!state.role._id} onClick={() => setState({ isShowAuth: true })}>设置角色权限</Button>
    </span>
  )

  const onRow = (role) => {
    return {
      onClick: event => { // 点击行
        console.log('row onClick()', role)
        setState({
          role
        })
      },
    }
  }

  const handleAddOk = async () => {
    formRef?.current?.submit?.()
    let params = formRef?.current?.getFieldsValue?.('RoleName')
    if (params.RoleName !== '') {
      let res = await reqAddRole(params.RoleName);
      // console.log('>>>>>', res);
      if (res.status === 0) {
        message.success('添加角色成功')
        const role = res.data
        const roles = [...state.roles, role]
        setState({
          roles,
          isShowAdd: false
        })
      } else {
        message.error('添加角色失败，请重试！')
      }
    }
  }

  const handleUpdateOk = async () => {
    const role = state.role
    let params = authRef?.current?.getmenus?.()
    role.menus = params
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    // console.log('>>>>!11', role);
    let res = await reqUpdateRole(role);
    // console.log('>>>>>>>>', res);
    if (res.status === 0) {
     
      //如果当前更新的自己角色权限强制退出
      if (role._id === memoryUtils.user.role._id) {
        message.info('设置角色权限请重新登录')
        storageUtils.removeUser()
        memoryUtils.user={};
        navigate('/login')
      } else {
        message.success('设置角色权限成功')
        setState({
          roles: [...state.roles],
          isShowAuth: false
        })
      }
    } else {
      message.error('设置角色权限失败')
    }
  }

  return (
    <Card title={title}>
      <Table
        bordered
        rowKey='_id'
        dataSource={state.roles}
        columns={columns}
        pagination={{ defaultPageSize: constants.PAGE_SIZE }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [state.role._id],
          onSelect: (role) => { // 选择某个radio时回调
            setState({
              role: role
            })
          }

        }}
        onRow={onRow}
      />
      <Modal
        title="添加角色"
        visible={state.isShowAdd}
        onOk={handleAddOk}
        onCancel={() => {
          setState({
            isShowAdd: false
          })
        }}
        okText={'确认'}
        cancelText={'取消'}
      >
        <AddFrom
          setForm={(form) => {
            formRef = form
          }}
        >
        </AddFrom>
      </Modal>
      <Modal
        title="设置角色权限"
        visible={state.isShowAuth}
        onOk={handleUpdateOk}
        onCancel={() => {
          setState({
            isShowAuth: false
          })
        }}
        okText={'确认'}
        cancelText={'取消'}
      >
        <AuthFrom ref={authRef} role={state.role}></AuthFrom>
      </Modal>
    </Card>
  )
}
