import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./index.css";
import Home from "./pages/Home";
import Products from "./components/Products";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Table from "./pages/Table";
import Category from "./pages/Category";
import SingleCategory from "./pages/Singlecategory";
import SearchResults from "./pages/SearchResults";
import Contact from "./components/Contact";
import About from "./components/About";
import Cart from "./pages/Cart";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryView from "./components/CategoryView";
import Profile from "./pages/Profile";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<SingleCategory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/table" element={<Table />} />
        <Route path="/category" element={<Category />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categoryview" element={<CategoryView />} />
         <Route path="/profile" element={<Profile/>} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
