import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const allProductsListRequest = createAsyncThunk('products/get/all', async (payload = {}) => {
    const {page, title} = payload;
    const { data } = await Api.getAllProductsList(page, title);

    return data;
});

export const addProductRequest = createAsyncThunk('products/add', async (payload = {}) => {
    const {onUploadProcess, ...params} = payload;
    const {data} = await Api.addProduct(onUploadProcess, params);

    return data;
});

export const updateProductRequest = createAsyncThunk('products/update', async (payload = {}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    const {data} = await Api.updateProduct(slugName, onUploadProcess, params);

    return data;
});

export const deleteProductRequest = createAsyncThunk('products/delete', async (payload = {}) => {
    const {slugName} = payload;
    const {data} = await Api.deleteProduct(slugName);

    return data;
});
