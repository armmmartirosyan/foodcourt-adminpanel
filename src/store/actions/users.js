import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allUsersListRequest = createAsyncThunk('users/get/all', async (payload = {}, {rejectWithValue}) => {
    const {page, name} = payload;
    let data;

    try{
        let newData= await Api.getAllUsersList(page, name);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleUserRequest = createAsyncThunk('users/get/single', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData= await Api.getSingleUser(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const changeUserStatusRequest = createAsyncThunk('users/delete', async (payload = {}, {rejectWithValue}) => {
    const { id, status } = payload;
    let data;

    try{
        let newData= await Api.changeUserStatus(id, status);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
