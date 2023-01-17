import {createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../Api";

export const allBranchesListRequest = createAsyncThunk('branches/get/all', async (payload = {}, {rejectWithValue}) => {
    let data;

    try{
        let newData= await Api.getAllBranchesList();
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const singleBranchRequest = createAsyncThunk('branches/get/single', async (payload = {}, {rejectWithValue}) => {
    const {slugName} = payload;
    let data;

    try{
        let newData= await Api.getSingleBranch(slugName);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const addBranchRequest = createAsyncThunk('branch/add', async (payload = {}, {rejectWithValue}) => {
    const {onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.addBranch(onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const updateBranchRequest = createAsyncThunk('branch/update', async (payload = {}, {rejectWithValue}) => {
    const {slugName, onUploadProcess, ...params} = payload;
    let data;

    try{
        let newData= await Api.updateBranch(slugName, onUploadProcess, params);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});

export const deleteBranchRequest = createAsyncThunk('branch/delete', async (payload = {}, {rejectWithValue}) => {
    const {id} = payload;
    let data;

    try{
        let newData= await Api.deleteBranch(id);
        data = newData.data;
    }catch (e) {
        return rejectWithValue(e.response.data);
    }

    return data;
});
