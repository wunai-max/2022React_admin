import React, { useEffect } from 'react'
import { Button, Card, message, Table, Modal } from 'antd';
import {
  PlusOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqAddClassify, reqClassifyList, reqUpDateClassify } from '../../api';
import { useSetState } from '../../components/hooks';
import AddFrom from './add-from';
import UpdateFrom from './update-form';


export default function Category() {

  const [state, setState] = useSetState({
    classifyList: [],
    subCategorys: [],
    loading: false,
    parentId: '0',
    parentName: '',
    title: '',
    isModalVisible: 0,
    categoryObj: {},
  })

  let formRef = null;
  let updateRef = null;

  useEffect(() => {
    getClassList();
  }, [state.parentId])

  const getClassList = async (parentIdNum) => {
    const parentId = parentIdNum || state.parentId
    setState({
      loading: true
    })
    let list = await reqClassifyList(state.parentId)
    setState({
      loading: false
    })
    if (list.status === 0) {
      if (parentId === '0') {
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

  const handleAddOk = async () => {
    if (state.isModalVisible === 1) {
      formRef?.current?.submit?.()
      let params = formRef?.current?.getFieldsValue?.('categoryObj')
      if (params.categoryName!=='') {
        let res = await reqAddClassify(params.categoryName, params.categoryId);
        if (res.status === 0) {
          message.success('添加成功')
          if (params.categoryId === state.parentId) {
            getClassList();
          } else if (params.parentId === '0') {
            getClassList('0');
          }
          handleCancel();
        } else {
          message.error('添加失败，请重试！')
        }
      }
    } else if (state.isModalVisible === 2) {
      updateRef?.current?.submit?.()
      let params = updateRef?.current?.getFieldsValue?.('categoryObj')
      if (params.categoryName!=='') {
        let res = await reqUpDateClassify(state.categoryObj._id, params.categoryName);
        if (res.status === 0) {
          message.success('修改成功')
          getClassList();
          handleCancel();
        } else {
          message.error('修改失败，请重试！')
        }
      }
    }
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
              isModalVisible: 2,
              categoryObj: item,
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
      <Modal
        title="添加分类"
        visible={state.isModalVisible === 1}
        onOk={handleAddOk}
        onCancel={handleCancel}
        okText={'确认'}
        cancelText={'取消'}
      >
        <AddFrom
          setForm={(form) => {
            formRef = form
          }}
          classifyList={state.classifyList}
          parentId={state.parentId}
        >
        </AddFrom>
      </Modal>
      <Modal
        title="更新分类"
        visible={state.isModalVisible === 2}
        onOk={handleAddOk}
        onCancel={handleCancel}
        okText={'确认'}
        cancelText={'取消'}
      >
        <UpdateFrom
          setForm={(form) => {
            updateRef = form
          }}
          categoryName={state.categoryObj.name}>
        </UpdateFrom>
      </Modal>
    </Card>
  )
}
