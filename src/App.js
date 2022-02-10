
import React from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import Login from './pages/login/login.jsx'
import Admin from './pages/admin/admin.jsx'


function App() {
  return ( 
   <BrowserRouter>
   <Routes> {/*只匹配其中一个*/}
      <Route exact path='/' element={<Admin/>}></Route>
      <Route exact path='/login' element={<Login/>}></Route>
      <Route exact path="*" element={<Navigate to="/" />} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;