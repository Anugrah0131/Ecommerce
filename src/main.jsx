import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import './index.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Products from './pages/Products'
import Cart from './pages/Cart'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/navbar' element={<Navbar />} />
      <Route path='/products' element={<Products />} />
      <Route path='/Cart' element={<Cart />} />
      </Routes>
    </BrowserRouter>
   
  </StrictMode>,
)
