import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allSlidesListRequest = createAsyncThunk('slides/get/all', async (payload = {}, {rejectWithValue}) => {
    let data;

    try{
        let newData= await Api.getAllSlidesList();
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleSlideRequest = createAsyncThunk('slides/get/single', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData= await Api.getSingleSlide(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addSlideRequest = createAsyncThunk('slides/add', async (payload = {}, {rejectWithValue}) => {
    const {onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.addSlide(onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateSlideRequest = createAsyncThunk('slides/update', async (payload = {}, {rejectWithValue}) => {
    const {id, onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.updateSlide(id, onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteSlideRequest = createAsyncThunk('slides/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData= await Api.deleteSlide(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
