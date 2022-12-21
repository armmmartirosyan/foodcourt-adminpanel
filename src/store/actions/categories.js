import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allCategoriesListRequest = createAsyncThunk('categories/getAll', async (payload = {}) => {
    const {name} = payload;
    const { data } = await Api.getAllCategoriesList(name);

    return data;
});

export const addCategoryRequest = createAsyncThunk('categories/add', async (payload = {}) => {
    const {onUploadProcess, ...props} = payload;
    const {data} = await Api.addCategory(onUploadProcess, props);

    return data;
});

export const updateCategoryRequest = createAsyncThunk('categories/update', async (payload = {}) => {
    const {slugName, onUploadProcess, ...props} = payload;
    const {data} = await Api.updateCategory(slugName, onUploadProcess, props);

    return data;
});

export const deleteCategoryRequest = createAsyncThunk('categories/delete', async (payload = {}) => {
    const {slugName} = payload;
    const {data} = await Api.deleteCategory(slugName);

    return data;
});
