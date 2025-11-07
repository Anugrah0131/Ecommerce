import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import './index.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Products from './components/Products'
import Details from './pages/Details'
import Login from './pages/Login'
import Card from './components/Card'
import Addtocart from './pages/Addtocart'
import Table from './pages/Table'
import Category from './pages/Category'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        
     <Routes>
      <Route path='/.navbar' element={<Navbar/>}/>
      <Route path='/' element={<Home />} />
      <Route path='/products' element={<Products />} />
      <Route path='/details/:id' element={<Details/>}/>
      <Route path='/' element={<Card/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/addtocart' element={<Addtocart/>}/>
      <Route path='/table' element={<Table/>}/>
      <Route path='/category' element={<Category/>}/>
     </Routes>
    </BrowserRouter>
   
  </StrictMode>,
)