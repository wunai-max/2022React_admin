
import React, { useEffect } from 'react'
import memeoryUtils from '../../utils/memoryUtils'
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Category from '../category/category';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Bar from '../charts/bar';
import Home from '../home/home';
import User from '../user/user';
import Role from '../role/role';
import Product from '../product/product';
import NotFound from '../not-found/not-found';
import { connect } from 'react-redux';

const { Footer, Sider, Content } = Layout;


function Admin(props) {

    const navigate = useNavigate()
    const user = props.user

    useEffect(() => {
        console.log('admin初始化只执行一次')

        if (!user || !user._id) {
            return navigate('/login')
        }
        return () => {
            // componentWillUnmount
            console.log('你离开了admin')
        }
    }, [props])

    return (
        <Layout style={{ minHeight: '100%' }}>
            <Sider>
                <LeftNav />
            </Sider>
            <Layout>
                <Header></Header>
                <Content style={{ margin: 20, backgroundColor: 'white' }}>
                    <Routes>
                        <Route path='/home' element={<Home />}></Route>
                        <Route path='/category' element={<Category />}></Route>
                        <Route path='/charts/line' element={<Line />}></Route>
                        <Route path='/charts/pie' element={<Pie />}></Route>
                        <Route path='/charts/bar' element={<Bar />}></Route>
                        <Route path='/user' element={<User />}></Route>
                        <Route path='/role' element={<Role />}></Route>
                        <Route path='/Product/*' element={<Product />}></Route>
                        <Route path='/*' element={<NotFound />}></Route>
                    </Routes>
                </Content>
                <Footer style={{ textAlign: 'center', color: '#aaaaaa' }}>推荐使用谷歌浏览器， 可以获得更佳页面操作体验</Footer>
            </Layout>
        </Layout>
    )
}

export default connect(
    state => ({ user: state.user }),
    {}
)(Admin); 
