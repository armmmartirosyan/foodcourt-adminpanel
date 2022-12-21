import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allNewsListRequest = createAsyncThunk('news/get/all', async (payload = {}) => {
    const {page, title} = payload;
    const { data } = await Api.getAllNewsList(page, title);

    return data;
});

export const addNewsRequest = createAsyncThunk('news/add', async (payload = {}) => {
    const {onUploadProcess, ...params} = payload;
    const {data} = await Api.addNews(onUploadProcess, params);

    return data;
});

export const updateNewsRequest = createAsyncThunk('news/update', async (payload = {}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    const {data} = await Api.updateNews(slugName, onUploadProcess, params);

    return data;
});

export const deleteNewsRequest = createAsyncThunk('news/delete', async (payload = {}) => {
    const {slugName} = payload;
    const {data} = await Api.deleteNews(slugName);

    return data;
});
