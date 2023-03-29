import {combineReducers} from "@reduxjs/toolkit";
import products from "./products";
import status from "./status";
import admin from "./admin";
import categories from "./categories";
import offers from "./offers";
import slides from "./slides";
import users from "./users";
import map from "./map";
import orders from "./orders";
import paymentTypes from "./paymentTypes";
import footer from "./footer";
import comments from "./comments";
import about from "./about";

export default combineReducers({
    status,
    admin,
    products,
    categories,
    offers,
    slides,
    users,
    map,
    orders,
    paymentTypes,
    footer,
    comments,
    about,
})
