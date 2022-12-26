import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const loginRequest = createAsyncThunk('admin/login',  (payload) =>payload)

export const registerAdminRequest = createAsyncThunk('admin/register', async (payload = {}) => {
    const { ...params } = payload;
    const { data } = await Api.registerAdmin(params);

    return data;
});

export const getAdminRequest = createAsyncThunk('admin/admin', async () => {
    const { data } = await Api.getAdmin();

    return data;
});

export const getAdminsListRequest = createAsyncThunk('admins/list', async () => {
    const { data } = await Api.getAllAdminsList();

    return data;
});

export const getSingleAdminRequest = createAsyncThunk('admin/single', async (payload = {}) => {
    const { id } = payload;
    const { data } = await Api.getSingleAdmin(id);

    return data;
});

export const modifyAdminAccountRequest = createAsyncThunk('admin/modify', async (payload = {}) => {
    const { id, ...params } = payload;
    const { data } = await Api.modifyAdminAccount(id, params);

    return data;
});

export const deleteAdminAccountRequest = createAsyncThunk('admin/delete', async (payload = {}) => {
    const { id } = payload;
    const { data } = await Api.deleteAdminAccount(id);

    return data;
});

export const modifyCurrentAccountRequest = createAsyncThunk('admin/modify/current', async (payload = {}) => {
    const { ...params } = payload;
    const { data } = await Api.modifyCurrentAccount(params);

    return data;
});

export const getKeyRequest = createAsyncThunk('admin/get/key', async (payload = {}) => {
    const { email } = payload;
    const { data } = await Api.getKey(email);

    return data;
});

export const changePassRequest = createAsyncThunk('admin/change/pass', async (payload = {}) => {
    const { email, password, token, confirmPassword } = payload;
    const { data } = await Api.changeAdminPass({email, password, token, confirmPassword});

    return data;
});
