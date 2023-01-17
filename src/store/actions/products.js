import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const allProductsListRequest = createAsyncThunk('products/get/all', async (payload = {}, {rejectWithValue}) => {
    const {page, title, category} = payload;
    let data;

    try{
        let newData= await Api.getAllProductsList(page, title, category);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleProductRequest = createAsyncThunk('products/get/single', async (payload = {}, {rejectWithValue}) => {
    const {slugName} = payload;
    let data;

    try{
        let newData= await Api.getSingleProduct(slugName);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addProductRequest = createAsyncThunk('products/add', async (payload = {}, {rejectWithValue}) => {
    const {onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData = await Api.addProduct(onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateProductRequest = createAsyncThunk('products/update', async (payload = {}, {rejectWithValue}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData = await Api.updateProduct(slugName, onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteProductRequest = createAsyncThunk('products/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData = await Api.deleteProduct(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
