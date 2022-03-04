import React, { useEffect } from 'react'
import { Button, Card, Table, Select, Input, message } from 'antd';
import {
    PlusOutlined,
} from '@ant-design/icons';
import { useSetState } from '../../components/hooks';
import LinkButton from '../../components/link-button';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api';
import { constants } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const Option = Select.Option

export default function ProductHome() {
    const navigate = useNavigate()
    const [state, setState] = useSetState({
        productList: [],
        total: 0,
        searchName: '',//搜索的关键字，
        searchType: 'productName', //根据哪个字段搜索
        loading: false,
        pageNum:1,
    })

    useEffect(() => {
        getProducts(1);
    }, [])

    const getProducts = async (pageNum) => {
        const { searchName, searchType } = state
        let res
        setState({
            loading: true,
            pageNum:pageNum,
        })
        if (searchName) {
            res = await reqSearchProducts({ pageNum, pageSize: constants.PAGE_SIZE, searchName, searchType })
        } else {
            res = await reqProducts(pageNum, constants.PAGE_SIZE)
        }
        setState({
            loading: false
        })
        if (res.status === 0) {
            const { list, total } = res.data;
            setState({
                productList: list,
                total: total
            })
        }
    }

    const updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus({productId, status})
        if (result.status === 0) {
            message.success('更新商品成功')
            getProducts(state.pageNum)
        }
    }

    const columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
        },
        {
            title: '价格',
            dataIndex: 'price',
            render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
        },
        {
            width: 100,
            title: '状态',
            // dataIndex: 'status',
            render: (product) => {
                const { status, _id } = product
                const newStatus = status === 1 ? 2 : 1
                // console.log('>>>>>1111wss',status,_id);
                return (
                    <span>
                        <Button
                            type='primary'
                            onClick={() => updateStatus(_id, newStatus)}
                        >
                            {status === 1 ? '下架' : '上架'}
                        </Button>
                        <span>{status === 1 ? '在售' : '已下架'}</span>
                    </span>
                )
            }
        },
        {
            width: 100,
            title: '操作',
            render: (product) => {
                return (
                    <span>
                        {/*将product对象使用state传递给目标路由组件*/}
                        <LinkButton onClick={() => navigate("/product/details", { replace: true, state: product })}>详情</LinkButton>
                        <LinkButton onClick={() => navigate("/product/addupdate", { replace: true,state: product })}>修改</LinkButton>
                    </span>
                )
            }
        },
    ]

    const title = (
        <span>
            <Select
                value={state.searchType}
                style={{ width: 150 }}
                onChange={value => setState({ searchType: value })}
            >
                <Option value='productName'>按名称搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input
                placeholder='关键字'
                style={{ width: 150, margin: '0 15px' }}
                value={state.searchName}
                onChange={event => setState({ searchName: event.target.value })}
            />
            <Button type='primary' onClick={() => {
                getProducts(1);
            }}>搜索</Button>
        </span>
    )

    const extra = (
        <Button type='primary' onClick={() => navigate("/product/addupdate", { replace: true,state:{add:true} })}>
            <PlusOutlined />
            添加商品
        </Button>
    )


    return (
        <Card title={title} extra={extra}>
            <Table
                bordered
                rowKey='_id'
                dataSource={state.productList}
                columns={columns}
                loading={state.loading}
                pagination={{
                    total: state.total,
                    defaultPageSize: constants.PAGE_SIZE,
                    showQuickJumper: true,
                    onChange: (pageNum) => getProducts(pageNum),
                }}
            />
        </Card>
    )
}
