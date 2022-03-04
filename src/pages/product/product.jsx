import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProductAddUpdate from './add-update'
import ProductDetails from './details'
import ProductHome from './home'
import './product.less'


export default function Product() {
  return (
    <Routes>
      <Route path='/' element={<ProductHome />}></Route>
      <Route path='/addupdate' element={<ProductAddUpdate />}></Route>
      <Route path='/details' element={<ProductDetails />}></Route>
      <Route  path='/*' element={<Navigate to="/Product" />}></Route> {/*重定向*/}
    </Routes>
  )
}
