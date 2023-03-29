import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const allProductsRequest = createAsyncThunk('products/get/all', async (payload = {}, {rejectWithValue}) => {
    let data;

    try{
        let newData= await Api.getAllProductsList();
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const productsListRequest = createAsyncThunk('products/get/list', async (payload = {}, {rejectWithValue}) => {
    const {page, title, category} = payload;
    let data;

    try{
        let newData= await Api.getProductsList(page, title, category);
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
    const {id, onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData = await Api.updateProduct(id, onUploadProcess, params);
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
