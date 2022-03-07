import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './index.less'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logoMan.png'
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';
import { useSetState } from '../hooks';
import memoryUtils from '../../utils/memoryUtils';


const { SubMenu } = Menu;

function LeftNav(props) {

  let location = useLocation()
  let data = location.pathname  //获取路由自动选中


  const [state, setState] = useSetState({
    openKey: '',
    data: ''
  })

  useEffect(() => {
    if (data.indexOf('/product') === 0) {
      setState({
        data: '/product'
      })
    } else {
      setState({
        data: data
      })
    }
    return () => {
      // componentWillUnmount
    }
  }, [data])

  const hasAuth = (item) => {
    //判断当前登录用户对item是否有权限
    //如何是admin直接通过
    //如果是公开的不是设置权限
    const { key, isPublic } = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if(item.children){// 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child=>menus.indexOf(child.key)!==-1)   //强制转换类型 ！！
    }
  }

  const getMenuNodes = useCallback((menuList) => {  //对比变量是否改变
    return menuList.map(item => {

      //如果
      if (hasAuth(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>
                {item.title}
              </Link>
            </Menu.Item>
          )
        } else {
          // 如果当前请求路由与当前菜单的某个子菜单的 key 匹配, 将菜单的 key 保存为 openKey
          if (item.children.find(cItem => data.indexOf(cItem.key) === 0)) {
            setState({
              openKey: item.key
            })
          }

          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }
    })
  }, [])//循环展示导航列表


  return useMemo(() => (
    <div className='left-nav'>
      <Link to='/home' className='logo-link'>
        <img src={logo} alt="logo" />
        <h1>react后台</h1>
      </Link>
      <Menu
        selectedKeys={[state.data]} //默认选中 可以选中多个值
        defaultOpenKeys={[state.openKey]}
        mode="inline"
        theme="dark"
      >
        {getMenuNodes(menuList)}
      </Menu>
    </div>
  ), [state.openKey, state.data])
}



export default LeftNav