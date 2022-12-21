import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allSlidesListRequest = createAsyncThunk('slides/get/all', async (payload = {}) => {
    const { data } = await Api.getAllSlidesList();

    return data;
});

export const addSlideRequest = createAsyncThunk('slides/add', async (payload = {}) => {
    const {onUploadProcess, ...params} = payload;
    const {data} = await Api.addSlide(onUploadProcess, params);

    return data;
});

export const updateSlideRequest = createAsyncThunk('slides/update', async (payload = {}) => {
    const {id, onUploadProcess, ...params} = payload;
    const {data} = await Api.updateSlide(id, onUploadProcess, params);

    return data;
});

export const deleteSlideRequest = createAsyncThunk('slides/delete', async (payload = {}) => {
    const {id} = payload;
    const {data} = await Api.deleteSlide(id);

    return data;
});
