import React from 'react'
import './index.less'
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';


const { SubMenu } = Menu;

export default function LeftNav() {

 const getMenuNodes = (menuList) => {

    return menuList.map(item=>{
       if(!item.children){
         return (
          <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.key}>
           {item.title}
          </Link>
          </Menu.Item>
         )
       }else{
         return(
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
          {getMenuNodes(item.children)}
         </SubMenu>
         )
       }   
    })
  }

  return (
    <div className='left-nav'>
      <Link to='/home' className='logo-link'>
        <img src={logo} alt="logo" />
        <h1>react后台</h1>
      </Link>
      <Menu
        defaultSelectedKeys={['1']} //默认选中
        defaultOpenKeys={['sub1']}  //默认打开
        mode="inline"
        theme="dark"
      >
        {getMenuNodes(menuList)}
      </Menu>
    </div>
  )
}
