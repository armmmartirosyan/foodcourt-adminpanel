import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allCategoriesListRequest = createAsyncThunk('categories/get/all', async (payload = {}, {rejectWithValue}) => {
    const {name} = payload;
    let data;

    try{
        let newData = await Api.getAllCategoriesList(name);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleCategoryRequest = createAsyncThunk('categories/get/single', async (payload = {}, {rejectWithValue}) => {
    const {slugName} = payload;
    let data;

    try{
        let newData = await Api.singleCategoryList(slugName);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addCategoryRequest = createAsyncThunk('categories/add', async (payload = {}, {rejectWithValue}) => {
    const {onUploadProcess, ...props} = payload;
    let data;

    try{
        let newData = await Api.addCategory(onUploadProcess, props);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateCategoryRequest = createAsyncThunk('categories/update', async (payload = {}, {rejectWithValue}) => {
    const {id, onUploadProcess, ...props} = payload;
    let data;

    try{
        let newData = await Api.updateCategory(id, onUploadProcess, props);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteCategoryRequest = createAsyncThunk('categories/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData = await Api.deleteCategory(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
