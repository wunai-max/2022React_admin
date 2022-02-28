import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { reqWeather } from '../../api';
import { formateDate } from '../../utils/dateUtils';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less'
import LinkButton from '../link-button';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import menuList from '../../config/menuConfig';

const { confirm } = Modal;
let timer = null

export default function Header() {

  let location = useLocation()
  let data = location.pathname  //获取路由
  const navigate = useNavigate()

  const [state, setState] = useState({
    lives: {},
  })
  const [time, setTime] = useState(formateDate(Date.now()))
  const [title, setTitle] = useState('')
  const [username,setUsername]=useState('')

  useEffect(() => {
    getWeather();
    getTime();
    getTitle();
    setUsername(memoryUtils.user.username);
    return () => {
      clearInterval(timer)
    }
  }, [data])

  const getWeather = useCallback(async () => {
    const result = await reqWeather({
      key: 'd679a3a2b367acc60ed882ba0eb9603d',
      city: '330108'
    })
    if (result.status === '1') {
      setState({
        lives: result.lives[0]
      })
    }
  }, [])

  const getTime = useCallback(() => {
    timer = setInterval(() => {
      const currentTime = formateDate(Date.now());
      setTime(currentTime)
    }, 1000);
  }, [])

  const getTitle = useCallback(() => {
    menuList.forEach(item => {
      if (item.key === data) {
        setTitle(item.title)
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => data.indexOf(cItem.key) === 0)
        // 如果有值才说明有匹配的
        if (cItem) {
          // 取出它的title
          setTitle(cItem.title)
        }
      }
    })
  }, [data])

  const quitLog = useCallback(() => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}

        // 跳转到login
        navigate('/login')
      }
    });
  }, [])

  return useMemo(() => (
    <div className="header">
      <div className="header-top">
        <span>欢迎, {username}</span>
        <LinkButton onClick={() => quitLog()}>退出</LinkButton>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">
          {title}
        </div>
        <div className="header-bottom-right">
          <span>{time}&nbsp;&nbsp;</span>
          <span>{state.lives.city}&nbsp;&nbsp;&nbsp;</span>
          <span>{state.lives.temperature}℃&nbsp;&nbsp;</span>
          <span>{state.lives.weather}</span>
        </div>
      </div>
    </div>
  ), [state.lives, time, title,username])
}
