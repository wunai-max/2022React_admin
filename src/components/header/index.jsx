import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { reqWeather } from '../../api';
import { formateDate } from '../../utils/dateUtils';
import './index.less'

export default function Header() {

  const [state,setState]=useState({
    lives:{},
  })
  const [time,setTime]=useState(formateDate(Date.now()))

  useEffect(()=>{
    getWeather();
    getTime();
  },[])

 const getWeather=useCallback(async()=>{
  const result = await reqWeather({
    key:'d679a3a2b367acc60ed882ba0eb9603d',
    city:'330108'
  })
  if(result.status==='1'){
      setState({
        lives:result.lives[0]
      })
  }
 },[]) 

 const getTime=useCallback(()=>{
   setInterval(() => {
     const currentTime=formateDate(Date.now());
     setTime(currentTime)
   }, 1000);
 },[])

  return useMemo(() => (
    <div className="header">
      <div className="header-top">
        <span>欢迎, admin</span>
        {/* <LinkButton onClick={this.logout}>退出</LinkButton> */}
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">
        首页
        </div>
        <div className="header-bottom-right">
          <span>{time}</span>
          <span>{state.lives.city}</span>
          <span>{state.lives.temperature}℃</span>
          <span>{state.lives.weather}</span>
        </div>
      </div>
    </div>
  ), [state.lives,time])
}
