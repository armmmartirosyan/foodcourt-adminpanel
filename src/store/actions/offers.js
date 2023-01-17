import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allOffersListRequest = createAsyncThunk('offers/get/all', async (payload = {}, {rejectWithValue}) => {
    const {title, category} = payload;
    let data;

    try{
        let newData= await Api.getAllOffersList(title, category);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleOfferRequest = createAsyncThunk('offers/get/single', async (payload = {}, {rejectWithValue}) => {
    const {slugName} = payload;
    let data;

    try{
        let newData= await Api.getSingleOffer(slugName);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addOfferRequest = createAsyncThunk('offers/add', async (payload = {}, {rejectWithValue}) => {
    const {onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.addOffer(onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateOfferRequest = createAsyncThunk('offers/update', async (payload = {}, {rejectWithValue}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.updateOffer(slugName, onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteOfferRequest = createAsyncThunk('offers/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData= await Api.deleteOffer(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
