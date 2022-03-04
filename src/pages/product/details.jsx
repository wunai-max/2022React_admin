import React, { useEffect } from 'react'
import { Card, List } from 'antd';
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetState } from '../../components/hooks';
import { constants } from '../../utils/constants';
import { reqCategory } from '../../api';

const Item = List.Item

export default function ProductDetails() {
  const location = useLocation()
  const navigate = useNavigate()

  const [state, setState] = useSetState({
    detailsDes: location?.state??{},
    cName1: '',
    cName2: '',
  })

  useEffect(() => {
    getClassId();
  }, [])

  const getClassId = async () => {
    const { pCategoryId, categoryId } = location.state
    if (pCategoryId === '0') { // 一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      setState({ cName1 })
    } else { // 二级分类下的商品
      /*
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
      const result2 = await reqCategory(categoryId) // 获取二级分类
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */

      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      setState({
        cName1,
        cName2
      })
    }
  }

  const title = (
    <span>
      <LinkButton>
        <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} onClick={() => navigate('/product')} />
      </LinkButton>
      <span>商品详情</span>
    </span>
  )

  return (
    <Card title={title} className='product-detail'>
      <List>
        <Item>
          <span className='left'>商品名称:</span>
          <span>{state.detailsDes.name}</span>
        </Item>
        <Item>
          <span className='left'>商品描述:</span>
          <span>{state.detailsDes.desc}</span>
        </Item>
        <Item>
          <span className="left">商品价格:</span>
          <span>{state.detailsDes.price}</span>
        </Item>
        <Item>
          <span className="left">所属分类:</span>
          <span>{state.cName1} {state.cName2 ? ' --> '+state.cName2 : ''}</span>
        </Item>
        <Item>
          <span className="left">商品图片:</span>
          <span>
              {
              state.detailsDes.imgs.map(img => (
                  <img
                    key={img}
                    src={constants.BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))
              }
            </span>
        </Item>
        <Item>
          <span className="left">商品详情:</span>
          <span dangerouslySetInnerHTML={{ __html: state.detailsDes.detail }}>
          </span>
        </Item>
      </List>
    </Card>
  )
}
