import React, { useEffect, useRef } from 'react'
import { Card, List, Form, Input, Upload, Button, Cascader, message } from 'antd';
import LinkButton from '../../components/link-button';
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useSetState } from '../../components/hooks';
import { reqAddOrUpdateProduct, reqClassifyList } from '../../api';
import { useLocation, useNavigate } from 'react-router-dom';
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor';


const { Item } = Form
const { TextArea } = Input;

export default function ProductAddUpdate(props) {
  const navigate = useNavigate()
  const location = useLocation()
  const modalPicturePop = useRef(null);
  const richText = useRef(null);

  const getCategoryId = () => {
    let arr = []
    if (location?.state?.add ?? false) {
      return arr
    } else {
      if ((location?.state?.pCategoryId ?? '') === '0') {
        arr.push((location?.state?.categoryId ?? ''))
      } else {
        arr.push((location?.state?.pCategoryId ?? ''))
        arr.push((location?.state?.categoryId ?? ''))
      }
      return arr
    }
  }

  const [state, setState] = useSetState({
    options: [],
    loadData: [],
    productData: location?.state?.add ?? false ? {} : location?.state ?? {},
    categoryIds: getCategoryId()
  })

  useEffect(() => {
    console.log('location.state', location?.state ?? {});
    getClassList('0')
  }, [])



  const onFinish = async (values) => {
    const { name, desc, price, categoryIds } = values
    let pCategoryId, categoryId
    let imgs = modalPicturePop?.current?.getImgs?.();
    let detail = richText?.current?.getDetail?.();
    if (categoryIds.length === 1) {
      pCategoryId = '0'
      categoryId = categoryIds[0]
    } else {
      pCategoryId = categoryIds[0]
      categoryId = categoryIds[1]
    }
    let product = { name, desc, price, imgs, detail, pCategoryId, categoryId }

    if (!(location?.state?.add ?? false)) {
      product._id = state.productData._id
    }
    console.log('product',product);
    let res = await reqAddOrUpdateProduct(product)
    if (res.status === 0) {
      message.success(`${(location?.state?.add ?? false) ? '添加' : '更新'}商品成功`)
      navigate('-1');
    } else {
      message.error(`${(location?.state?.add ?? false) ? '添加' : '更新'}商品失败`)
    }

  }

  // 指定Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 8 }, // 右侧包裹的宽度
  }

  const initOptions = async (data) => {

    const { pCategoryId, categoryId } = location?.state ?? {}
    const options = data.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false,
    }))

    if (!(location?.state?.add ?? false) && pCategoryId !== '0') {
      const subCategorys = await getClassList(pCategoryId);
      const cOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true,
      }))

      const targetOption = options.find(option => option.value === pCategoryId)
      targetOption.children = cOptions
    }

    setState({
      options: options
    })
  }

  const getClassList = async (parentId) => {
    let res = await reqClassifyList(parentId)
    if (res.status === 0) {
      const data = res.data
      if (parentId === '0') {
        initOptions(data)
      } else {
        return data;
      }

    }
  }

  const loadData = async selectedOptions => {
    //得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // console.log('>>>>@@@@', targetOption);
    targetOption.loading = true;

    // 根据选中的分类，请求获取二级分类列表
    const subCategorys = await getClassList(targetOption.value);
    // console.log('>>>>@@@@', subCategorys);  
    if (subCategorys && subCategorys.length > 0) {
      const cOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true,
      }))
      targetOption.loading = false;
      targetOption.children = cOptions
    } else {
      targetOption.loading = false;
      targetOption.isLeaf = true
    }
    setState({
      options: [...state.options]
    });
  };

  const title = (
    <span>
      <LinkButton>
        <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} onClick={() => navigate('/product')} />
      </LinkButton>
      <span>添加商品</span>
    </span>
  )
  return (
    <Card title={title}>
      <Form {...formItemLayout} onFinish={onFinish}>
        <Item name="name" label="商品名称" initialValue={state.productData.name} rules={[
          { required: true, whitespace: true, message: '商品名称必须输入' },]}>
          <Input placeholder='请输入商品名称' />
        </Item>
        <Item name="desc" label="商品描述" initialValue={state.productData.desc} rules={[
          { required: true, whitespace: true, message: '商品描述必须输入' },]} >
          <TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />
        </Item>
        <Item name="price" label="商品价格" initialValue={state.productData.price} rules={[
          { required: true, message: '商品价格必须输入' }]} >
          <Input prefix="￥" type='number' placeholder='请输入商品价格' addonAfter='元' />
        </Item>
        <Item name="categoryIds" label="商品分类" initialValue={state.categoryIds} rules={[
          { required: true, message: '必须指定商品分类' }]} >
          <Cascader options={state.options} loadData={loadData} />
        </Item>
        <Item label="商品图片" >
          <PicturesWall ref={modalPicturePop} imgs={state.productData.imgs}></PicturesWall>
        </Item>
        <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <RichTextEditor ref={richText} detail={state.productData.detail} ></RichTextEditor>
        </Item>
        <Item wrapperCol={{ offset: 0, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Item>
      </Form>
    </Card>
  )
}
