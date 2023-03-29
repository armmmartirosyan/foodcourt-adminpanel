import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const getAboutRequest = createAsyncThunk('about/get', async (payload = {}, {rejectWithValue}) => {
    let data;

    try{
        let newData = await Api.getAbout();
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const createAboutRequest = createAsyncThunk('about/create', async (payload = {}, {rejectWithValue}) => {
    const {...params} = payload;
    let data;

    try{
        let newData = await Api.createAbout(params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateAboutRequest = createAsyncThunk('about/update', async (payload = {}, {rejectWithValue}) => {
    const {id, ...params} = payload;
    let data;

    try{
        let newData = await Api.updateAbout(id, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
