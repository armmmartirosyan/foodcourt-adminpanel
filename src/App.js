import React from 'react';
import {ToastContainer} from "react-toastify";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import OrdersPage from "./pages/OrdersPage";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Offers from "./pages/Offers";
import Slides from "./pages/Slides";
import Users from "./pages/Users";
import Admin from "./pages/Admin";
import Branches from "./pages/Branches";
import Profile from "./pages/Profile";
import SingleSlide from "./pages/SingleSlide";
import SingleOffer from "./pages/SingleOffer";
import SingleCategory from "./pages/SingleCategory";
import SingleProduct from "./pages/SingleProduct";
import SingleAdmin from "./pages/SingleAdmin";
import SingleUser from "./pages/SingleUser";
import SingleBranch from "./pages/SingleBranch";
import ForgotPassword from "./pages/ForgotPassword";
import SingleOrder from "./pages/SingleOrder";
import PaymentTypes from "./pages/PaymentTypes";
import SinglePaymentType from "./pages/SinglePaymentType";
import NotFound from "./pages/NotFound";
import Footer from "./pages/Footer";
import SingleFooterSocial from "./pages/SingleFooterSocial";
import Comments from "./pages/Comments";
import SingleComment from "./pages/SingleComment";
import About from "./pages/About";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/orders' element={<OrdersPage/>}/>
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

                    <Route path='/payment-types' element={<PaymentTypes/>}/>
                    <Route path='/payment-types/add' element={<SinglePaymentType/>}/>
                    <Route path='/payment-types/:id' element={<SinglePaymentType/>}/>

                    <Route path='/offers' element={<Offers/>}/>
                    <Route path='/offers/add' element={<SingleOffer/>}/>
                    <Route path='/offers/:slugName' element={<SingleOffer/>}/>

                    <Route path='/slides' element={<Slides/>}/>
                    <Route path='/slides/add' element={<SingleSlide/>}/>
                    <Route path='/slides/:id' element={<SingleSlide/>}/>

                    <Route path='/footer' element={<Footer/>}/>
                    <Route path='/footer/social' element={<SingleFooterSocial/>}/>
                    <Route path='/footer/social/:id' element={<SingleFooterSocial/>}/>

                    <Route path='/comments' element={<Comments/>}/>
                    <Route path='/comments/:id' element={<SingleComment/>}/>

                    <Route path='/about' element={<About/>}/>

                    <Route path='/not-found' element={<NotFound/>}/>
                    <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer closeOnClick visibilityTime={2000} autoHide={true}/>
        </>
    );
}

export default App;
