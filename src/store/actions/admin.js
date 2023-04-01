import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const loginRequest = createAsyncThunk('admin/login', async (payload = {}, {rejectWithValue}) => {
    const {email, password, remember} = payload;
    let data;

    try {
        const newData = await Api.signIn(email, password);

        data = {...newData.data, remember};
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
})

export const registerAdminRequest = createAsyncThunk('admin/register', async (payload = {}, {rejectWithValue}) => {
    const {...params} = payload;
    let data;

    try {
        const newData = await Api.registerAdmin(params);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const getAdminRequest = createAsyncThunk('admin/admin', async (payload, {rejectWithValue}) => {
    let data;

    try {
        const newData = await Api.getAdmin();

        data = newData.data;
    } catch (e) {
        return rejectWithValue({...e.response.data, status: e.response.status});
    }

    return data;
});

export const getAdminsListRequest = createAsyncThunk('admins/list', async (payload, {rejectWithValue}) => {
    let data;

    try {
        const newData = await Api.getAllAdminsList();

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const getSingleAdminRequest = createAsyncThunk('admins/single', async (payload, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try {
        const newData = await Api.getSingleAdmin(id);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const modifyAdminAccountRequest = createAsyncThunk('admin/modify', async (payload = {}, {rejectWithValue}) => {
    const {id, ...params} = payload;
    let data;

    try {
        const newData = await Api.modifyAdminAccount(id, params);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteAdminAccountRequest = createAsyncThunk('admin/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try {
        const newData = await Api.deleteAdminAccount(id);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const modifyCurrentAccountRequest = createAsyncThunk('admin/modify/current', async (payload = {}, {rejectWithValue}) => {
    const {...params} = payload;
    let data;

    try {
        const newData = await Api.modifyCurrentAccount(params);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const getKeyRequest = createAsyncThunk('admin/get/key', async (payload = {}, {rejectWithValue}) => {
    const {email} = payload;
    let data;

    try {
        const newData = await Api.getKey(email);

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const changePassRequest = createAsyncThunk('admin/change/pass', async (payload = {}, {rejectWithValue}) => {
    const {email, password, token, confirmPassword} = payload;
    let data;

    try {
        const newData = await Api.changeAdminPass({email, password, token, confirmPassword});

        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
