import { createReducer } from "@reduxjs/toolkit";
import {getAdminRequest, getAdminsListRequest, loginRequest} from "../actions/admin";
import Account from "../../helpers/Account";

const initialState = {
    token: '',
    admin: {},
    adminsList: [],
}

export default createReducer(initialState, {
    [loginRequest.fulfilled]: (state, action) => {
        const remember = action.payload.remember;
        const token = action.payload.data.token;

        Account.setToken(token, remember);

        state.token = token;
        state.admin = action.payload.data.admin;
    },

    [getAdminRequest.fulfilled]: (state, action) => {
        state.admin = action.payload.admin;
    },

    [getAdminsListRequest.fulfilled]: (state, action) => {
        state.adminsList = action.payload.admins;
    },
});
