import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allOffersListRequest = createAsyncThunk('offers/get/all', async (payload = {}) => {
    const {title} = payload;
    const { data } = await Api.getAllOffersList(title);

    return data;
});

export const addOfferRequest = createAsyncThunk('offers/add', async (payload = {}) => {
    const {onUploadProcess, ...params} = payload;
    const {data} = await Api.addOffer(onUploadProcess, params);

    return data;
});

export const updateOfferRequest = createAsyncThunk('offers/update', async (payload = {}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    const {data} = await Api.updateOffer(slugName, onUploadProcess, params);

    return data;
});

export const deleteOfferRequest = createAsyncThunk('offers/delete', async (payload = {}) => {
    const {slugName} = payload;
    const {data} = await Api.deleteOffer(slugName);

    return data;
});
