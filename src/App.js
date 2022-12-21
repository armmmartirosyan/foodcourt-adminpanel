import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import {ToastContainer} from "react-toastify";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import News from "./pages/News";
import Offers from "./pages/Offers";
import Slides from "./pages/Slides";
import Users from "./pages/Users";
import Admin from "./pages/Admin";
import Branches from "./pages/Branches";
import Profile from "./pages/Profile";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login/>}/>
                    <Route path='/home' element={<Home/>}/>
                    <Route path='/products' element={<Products/>}/>
                    <Route path='/categories' element={<Categories/>}/>
                    <Route path='/news' element={<News/>}/>
                    <Route path='/offers' element={<Offers/>}/>
                    <Route path='/slides' element={<Slides/>}/>
                    <Route path='/users' element={<Users/>}/>
                    <Route path='/admin' element={<Admin/>}/>
                    <Route path='/maps' element={<Branches/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer closeOnClick visibilityTime={2000} autoHide={true}/>
        </>
    );
}

export default App;
