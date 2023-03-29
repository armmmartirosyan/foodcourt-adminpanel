import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const getCommentsRequest = createAsyncThunk('comment/get/all', async (payload = {}, {rejectWithValue}) => {
    let data;

    try {
        let newData = await Api.getComments();
        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const getSingleCommentRequest = createAsyncThunk('comment/get/single', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try {
        let newData = await Api.getSingleComment(id);
        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateCommentStatusRequest = createAsyncThunk('comment/get/all', async (payload = {}, {rejectWithValue}) => {
    const {id, status} = payload;
    let data;

    try {
        let newData = await Api.updateCommentStatus(id, status);
        data = newData.data;
    } catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
