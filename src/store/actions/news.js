import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allNewsListRequest = createAsyncThunk('news/get/all', async (payload = {}, {rejectWithValue}) => {
    const {page, title} = payload;
    let data;

    try{
        let newData= await Api.getAllNewsList(page, title);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleNewsRequest = createAsyncThunk('news/get/single', async (payload = {}, {rejectWithValue}) => {
    const {slugName} = payload;
    let data;

    try{
        let newData= await Api.getSingleNews(slugName);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addNewsRequest = createAsyncThunk('news/add', async (payload = {}, {rejectWithValue}) => {
    const {onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.addNews(onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateNewsRequest = createAsyncThunk('news/update', async (payload = {}, {rejectWithValue}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.updateNews(slugName, onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteNewsRequest = createAsyncThunk('news/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData= await Api.deleteNews(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
