import {createReducer} from "@reduxjs/toolkit";
import Account from "../../helpers/Account";

const initialState = {
    token: '',
    admin: {},
    adminsList: [],
    singleAdmin: {},
}

export default createReducer(initialState, (builder) => {
    builder
        .addMatcher((action) => action.type.endsWith('admin/login/fulfilled'), (state, action) => {
            const remember = action.payload.remember;
            const token = action.payload.token;

            Account.setToken(token, remember);

            state.token = token;
            state.admin = action.payload.admin;
        })
        .addMatcher((action) => action.type.endsWith('admin/admin/fulfilled'), (state, action) => {
            state.admin = action.payload.admin;
        })
        .addMatcher((action) => action.type.endsWith('admin/admin/rejected'), (state, action) => {
            if(action?.payload?.status === 401){
                Account.deleteToken();
                window.location.href = "/";
            }
        })
        .addMatcher((action) => action.type.endsWith('admins/list/fulfilled'), (state, action) => {
            state.adminsList = action.payload.admins;
        })
        .addMatcher((action) => action.type.endsWith('admins/single/fulfilled'), (state, action) => {
            state.singleAdmin = action.payload.admin;
        })
        .addMatcher((action) => action.type.endsWith('admin/modify/current/fulfilled'), (state, action) => {
            state.admin = action.payload.updatedAdmin;
        })
})


