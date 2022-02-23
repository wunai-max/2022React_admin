import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './index.less'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';


const { SubMenu } = Menu;

function LeftNav(props) {

  let location = useLocation()
  let data = location.pathname  //获取路由自动选中


  const [state, setState] = useState({
    openKey: '',
  })

  useEffect(() => {
    return () => {
      // componentWillUnmount
    }
  }, [])

  const getMenuNodes = useCallback((menuList) => {  //对比变量是否改变
    return menuList.map(item => {
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
    })
  }, [])//循环展示导航列表




  return useMemo(() => (
    <div className='left-nav'>
      <Link to='/home' className='logo-link'>
        <img src={logo} alt="logo" />
        <h1>react后台</h1>
      </Link>
      <Menu
        defaultSelectedKeys={[data]} //默认选中 可以选中多个值
        defaultOpenKeys={[state.openKey]}
        mode="inline"
        theme="dark"
      >
        {getMenuNodes(menuList)}
      </Menu>
    </div>
  ), [state.openKey, data])
}



export default LeftNav