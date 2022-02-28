import React, { useEffect, useState } from 'react'
import { Button, Card, message, Table, Modal } from 'antd';
import {
  PlusOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqClassifyList } from '../../api';
import { useSetState } from '../../components/hooks';
import AddFrom from './add-from';

export default function Category() {


  const [state, setState] = useSetState({
    classifyList: [],
    subCategorys: [],
    loading: false,
    parentId: '0',
    parentName: '',
    title: '',
    isModalVisible: 0
  })

  useEffect(() => {
    getClassList();
  }, [state.parentId])

  const getClassList = async () => {
    setState({
      loading: true
    })
    let list = await reqClassifyList(state.parentId)
    setState({
      loading: false
    })
    if (list.status === 0) {
      if (state.parentId === '0') {
        setState({
          classifyList: list.data,
          title: '一级分类列表'
        })
      } else {
        let title = (<span>
          <LinkButton onClick={() => {
            setState({
              parentId: '0',
            })
          }}>一级分类列表</LinkButton>
          <ArrowRightOutlined />
          <span>{state.parentName}</span>
        </span>)
        setState({
          subCategorys: list.data,
          title: title
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  const getSubClassList = (item) => {
    setState({
      parentId: item._id,
      parentName: item.name,
    })
  }

  const handleAddOk = () => {
    if (state.isModalVisible === 1) {
      console.log(111);
    } else if (state.isModalVisible === 2) {
      console.log(222);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setState({
      isModalVisible: 0
    })
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      render: (item) => (
        <span>
          <LinkButton onClick={() => {
            setState({
              isModalVisible: 2
            })
          }}>修改分类</LinkButton>
          {state.parentId === '0' ? (
            <LinkButton onClick={() => getSubClassList(item)}>查看子分类</LinkButton>
          ) : null}
        </span>
      )
    },
  ];

  const extra = (<Button type='primary' onClick={() => {
    setState({
      isModalVisible: 1
    })
  }}> <PlusOutlined /> 添加 </Button>)

  return (
    <Card title={state.title} extra={extra}>
      <Table
        bordered
        rowKey='_id'
        dataSource={state.parentId === '0' ? state.classifyList : state.subCategorys}
        columns={columns}
        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        loading={state.loading}
      />
      <Modal title="添加分类" visible={state.isModalVisible === 1} onOk={handleAddOk} onCancel={handleCancel}>
      <AddFrom></AddFrom>
      </Modal>
      <Modal title="更新分类" visible={state.isModalVisible === 2} onOk={handleAddOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </Card>
  )
}
