import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const getFooterRequest = createAsyncThunk('footer/get', async (payload = {}, {rejectWithValue}) => {
    let data;

    try{
        let newData = await Api.getFooter();
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const createFooterRequest = createAsyncThunk('footer/create', async (payload = {}, {rejectWithValue}) => {
    const {...params} = payload;
    let data;

    try{
        let newData = await Api.createFooter(params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateFooterRequest = createAsyncThunk('footer/update', async (payload = {}, {rejectWithValue}) => {
    const {id, ...params} = payload;
    let data;

    try{
        let newData = await Api.updateFooter(id, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const getSingleFooterSocialRequest = createAsyncThunk('social/get/single', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData = await Api.getSingleFooterSocial(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addFooterSocialRequest = createAsyncThunk('social/add', async (payload = {}, {rejectWithValue}) => {
    const {onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData = await Api.addFooterSocial(onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateFooterSocialRequest = createAsyncThunk('social/update', async (payload = {}, {rejectWithValue}) => {
    const {id, onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData = await Api.updateFooterSocial(id, onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteFooterSocialRequest = createAsyncThunk('social/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData = await Api.deleteFooterSocial(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
