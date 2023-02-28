import {combineReducers} from "@reduxjs/toolkit";
import products from "./products";
import status from "./status";
import admin from "./admin";
import categories from "./categories";
import news from "./news";
import offers from "./offers";
import slides from "./slides";
import users from "./users";
import map from "./map";
import orders from "./orders";
import paymentTypes from "./paymentTypes";

export default combineReducers({
    status,
    admin,
    products,
    categories,
    news,
    offers,
    slides,
    users,
    map,
    orders,
    paymentTypes,
})
