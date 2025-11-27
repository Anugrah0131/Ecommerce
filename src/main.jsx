import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Addtocart from "./pages/Addtocart";
import Table from "./pages/Table";
import Category from "./pages/Category";
import SingleCategory from "./pages/Singlecategory";
import SearchResults from "./pages/SearchResults";  
import Signup from "./components/SignUp";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<SingleCategory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addtocart" element={<Addtocart />} />
        <Route path="/table" element={<Table />} />
        <Route path="/category" element={<Category />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
