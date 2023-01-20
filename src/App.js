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
import SingleSlide from "./pages/SingleSlide";
import SingleOffer from "./pages/SingleOffer";
import SingleNews from "./pages/SingleNews";
import SingleCategory from "./pages/SingleCategory";
import SingleProduct from "./pages/SingleProduct";
import SingleAdmin from "./pages/SingleAdmin";
import SingleUser from "./pages/SingleUser";
import SingleBranch from "./pages/SingleBranch";
import ForgotPassword from "./pages/ForgotPassword";
import SingleOrder from "./pages/SingleOrder";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/home' element={<Home/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/order/:id' element={<SingleOrder/>}/>

                    <Route path='/' element={<Login/>}/>
                    <Route path='/forgot-password' element={<ForgotPassword/>}/>

                    <Route path='/maps' element={<Branches/>}/>
                    <Route path='/maps/add' element={<SingleBranch/>}/>
                    <Route path='/maps/:id' element={<SingleBranch/>}/>

                    <Route path='/users' element={<Users/>}/>
                    <Route path='/users/add' element={<SingleUser/>}/>
                    <Route path='/users/:id' element={<SingleUser/>}/>

                    <Route path='/admin' element={<Admin/>}/>
                    <Route path='/admin/add' element={<SingleAdmin/>}/>
                    <Route path='/admin/:id' element={<SingleAdmin/>}/>

                    <Route path='/products' element={<Products/>}/>
                    <Route path='/products/add' element={<SingleProduct/>}/>
                    <Route path='/products/:slugName' element={<SingleProduct/>}/>

                    <Route path='/categories' element={<Categories/>}/>
                    <Route path='/categories/add' element={<SingleCategory/>}/>
                    <Route path='/categories/:slugName' element={<SingleCategory/>}/>

                    <Route path='/news' element={<News/>}/>
                    <Route path='/news/add' element={<SingleNews/>}/>
                    <Route path='/news/:slugName' element={<SingleNews/>}/>

                    <Route path='/offers' element={<Offers/>}/>
                    <Route path='/offers/add' element={<SingleOffer/>}/>
                    <Route path='/offers/:slugName' element={<SingleOffer/>}/>

                    <Route path='/slides' element={<Slides/>}/>
                    <Route path='/slides/add' element={<SingleSlide/>}/>
                    <Route path='/slides/:id' element={<SingleSlide/>}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer closeOnClick visibilityTime={2000} autoHide={true}/>
        </>
    );
}

export default App;
